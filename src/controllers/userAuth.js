const { db } = require("../db");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { sendMailler } = require("../utils/sendMailler");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { config } = require("../config");
const jwt = require("jsonwebtoken");
const { s3 } = require("../uploader/upload");

// Get all users -- Admin
const getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await db.user.find().select("-password");
  res.status(200).json({ success: true, users });
});

// Get single user details -- Admin
const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await db.user.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user });
});

// Get own details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const user = await db.user.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user });
});

// Update user profile
const updateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const { firstName, lastName, email } = req.body;

  const newUserDetails = { firstName, lastName, email };

  const user = await db.user.findByIdAndUpdate(userId, newUserDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// Update user avatar
const updateAvatar = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload an image" });
  }

  const params = {
    Bucket: config.aws.awsBucketName,
    Key: `avatars/${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const result = await s3.upload(params).promise();
  const avatarUrl = result.Location;

  const user = await db.user.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
  
  res.status(200).json({ success: true, user });
});

// Update password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await db.user.findById(userId).select("+password");

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) {
    return res.status(401).json({ success: false, message: "Old password is incorrect" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});

// Delete account
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  await db.user.findByIdAndDelete(userId);
  res.status(200).json({ success: true, message: "Account deleted successfully" });
});

// Delete user -- Admin
const deleteUserByAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await db.user.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// Update user role -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role, email } = req.body;
  const user = await db.user.findOneAndUpdate({ email: email }, { role: role }, { new: true });
  
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, message: "User role updated successfully" });
});

// Logout
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Add shipping info
const addShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const { name, address, city, state, country, pinCode, phone } = req.body;

  const user = await db.user.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if this address already exists to avoid duplicates
  const addressExists = user.shippingInfo.some(
    (info) => 
      info.address === address && 
      info.pinCode === pinCode && 
      info.phone === phone
  );

  if (!addressExists) {
    user.shippingInfo.push({ name, address, city, state, country, pinCode, phone });
    await user.save();
  }

  res.status(200).json({ success: true, user });
});

module.exports = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
  updatePassword,
  updateUserRole,
  getUserDetails,
  updateAvatar,
  deleteUserByAdmin,
  addShippingInfo,
};
