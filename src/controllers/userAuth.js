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
  const { firstName, lastName, email, phone, dob } = req.body;

  const newUserDetails = { firstName, lastName, email, phone, dob };

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

// Update shipping info
const updateShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const { addressId, name, address, city, state, country, pinCode, phone } = req.body;

  const user = await db.user.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const shippingIndex = user.shippingInfo.findIndex(
    (item) => item._id.toString() === addressId
  );

  if (shippingIndex === -1) {
    return res.status(404).json({ success: false, message: "Address not found" });
  }

  user.shippingInfo[shippingIndex] = {
    ...user.shippingInfo[shippingIndex]._doc,
    name,
    address,
    city,
    state,
    country,
    pinCode,
    phone
  };

  await user.save();

  res.status(200).json({ success: true, user });
});

// Delete shipping info
const deleteShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const { addressId } = req.params;

  const user = await db.user.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.shippingInfo = user.shippingInfo.filter(
    (item) => item._id.toString() !== addressId
  );

  await user.save();

  res.status(200).json({ success: true, user });
});

// Forgot Password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await db.user.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found with this email" });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${config.frontend_url}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMailler({
      email: user.email,
      subject: `Sopyshop Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ success: false, message: error.message });
  }
});

// Reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await db.user.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Reset Password Token is invalid or has been expired",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ success: false, message: "Password does not match" });
  }

  // Hash and update password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
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
  updateShippingInfo,
  deleteShippingInfo,
  forgotPassword,
  resetPassword,
};
