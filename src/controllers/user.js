const { db } = require("../db");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const bcrypt = require("bcrypt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// User registration (sign up)
const signUp = catchAsyncErrors(async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body is missing" });
  }
  const { firstName, lastName, email, phone, dob, password } = req.body;

  // Check if user already exists
  const existingUser = await db.user.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email or phone number already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await db.user.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    password: hashedPassword,
  });

  res.status(201).json({ success: true, user });
});

// User login (sign in)
const signIn = catchAsyncErrors(async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, message: "Request body is missing" });
  }
  const { identifier, email, phone, password } = req.body;
  const loginId = identifier || email || phone;

  if (!loginId || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter both identifier (email or phone) and password." 
    });
  }

  // Check if user exists (search by phone or email)
  const user = await db.user.findOne({
    $or: [{ phone: loginId }, { email: loginId }],
  }).select("+password");

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email/phone or password" });
  }

  // Generate JWT
  const token = jwt.sign(
    { user: { id: user._id, role: user.role } },
    config.jwt.jwtSecretKey,
    { expiresIn: '7d' }
  );

  res.status(200).json({ success: true, token, user });
});

module.exports = { signUp, signIn };
