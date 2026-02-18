const mongoose = require("mongoose");
const moment = require("moment");
const crypto = require("crypto");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    minlength: [2, "First name should have more than 2 characters"],
    maxlength: [30, "First name cannot exceed 30 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    minlength: [2, "Last name should have more than 2 characters"],
    maxlength: [30, "Last name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: true,
    match: [/^\d{10}$/, "Please enter a valid phone number"],
  },
  dob: {
    type: Date,
    required: [true, "Please enter your date of birth"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [4, "Password should have more than 4 characters"],
    maxlength: [100, "Password cannot exceed 100 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetpasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
