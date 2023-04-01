const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");
const { sendMailler } = require("../utills/sendMailler");
const crypto = require("crypto");
const { errorHandeler } = require("../middlewere/errorHandeler");
const bcrypt = require("bcrypt");
const { config } = require("../config");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  const data = await db.user.find(
    {},
    { name: 1, userName: 1, email: 1, role: 1 , createdAt: 1, createdAt:1, avatar:1}
  );
  return res.send(data);
};

const getUser = async (req, res) => {
  const userId = req.params._id;
  const data = await db.user.findOne(userId, {
    name: 1,
    userName: 1,
    email: 1,
  });
  return res.send(data);
};

const updateUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndUpdate(
    { userId },
    { name: 1, userName: 1, email: 1 }
  );
  return res.send(data);
};

const deleteUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndDelete(userId);
  return res.send({ detail: "User Deleted" });
};

// logOut user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({ success: true, massage: "Logged Out User" });
});

const forwordPassword = catchAsyncErrors(async (req, res, next) => {
  const findUser = await db.user.findOne({ email: req.body.email });
  if (!findUser) {
    return next(res.status(404).send("user not found"));
  }

  // get Reset Password Token

  const resetToken = findUser.getResetPasswordToken();

  await findUser.save({ validateBeforeSave: false });

  //Create reset password url
  const resetUrl = `http://localhost:5000/api/v1/reset/password/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email, then please ignore.`;

  try {
    await sendMailler({
      email: findUser.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    return res.status(200).send({
      success: true,
      massage: `Email sent to ${findUser.email}} successfully ${resetUrl}`,
    });
  } catch (error) {
    findUser.resetPasswordToken = undefined;
    findUser.resetPasswordExplre = undefined;

    await findUser.save({ validateBeforeSave: false });
    return next(
      res.status(500).send("email not send " + error.massage + error)
    );
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await db.user.findOne({
    resetPasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      res
        .status(404)
        .send("reset password token is invalid or has been expired" + user)
    );
  }

  if (req.body.password !== req.body.comfirmPassword) {
    return next(res.status(404).send("Password dose not match"));
  }

  const password = req.body.password;
  const passHash = await bcrypt.hash(password, 10);

  user.password = passHash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExplre = undefined;

  await user.save();
  return next(res.status(200).send(res + user));
});

const updatePassword = catchAsyncErrors(async (req, res, next) => {
  let oldPassword = req.body.oldPassword;
  let userId = req.user.user._id;

  const user = await db.user.findById(userId).select("+password");
  if (!user) {
    return res.status(404).send({ detail: "User not found" });
  }

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) {
    return res.status(400).send({ detail: "Invalid credentials" });
  }

  if (req.body.newPassword !== req.body.comfirmPassword) {
    return res.status(404).send("Password dose not match");
  }

  user.password = req.body.newPassword;

  var token = jwt.sign(user, config.jwt.jwtSecretKey);
  await user.save();
  return res.status(200).cookie("token", token).send({
    detail: "User Password Updated",
    token: token,
    user: user,
  });
});

const updateUserRole = async (req, res, next) => {
  const email = req.body.email;
  const newRole = req.body.role;

  const user = await db.user.findOneAndUpdate(
    { email: email },
    { role: newRole }
  );
  if (!user) {
    return res.status(404).send({ detail: "User not found" });
  }

  return res.status(200).send({
    detail: "User role update succesfull ",
    success: true,
  });
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
  forwordPassword,
  resetPassword,
  updatePassword,
  updateUserRole,
};