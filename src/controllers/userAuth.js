const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");
const { sendMailler } = require("../utills/sendMailler");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { config } = require("../config");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../uploder/upload");

const getUsers = async (req, res) => {
  try {
    const usersData = await db.user.find().select("-password");
    return res.status(200).send({ success: true, users: usersData });
  } catch (error) {
    return res.status(401).send({ success: false, message: "users not found" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await db.user.findById(req.params.id).select("-password");

    if (!user) {
      return res
        .status(500)
        .send({ success: false, massage: "Product not found" });
    }

    return res.status(200).send({ success: true, user });
  } catch (error) {
    return res.status(401).send({ success: false, message: "users not found" });
  }
};

const updateUser = async (req, res) => {
  try {
    let userId = req.user.user._id;
    if (!userId) {
      return res.send("user are unothorised");
    }

    const updatedUser = {
      name: req.body.name,
      username: req.body.username,
    };

    let user = await db.user.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user.user._id;

  if (!userId) {
    return res.status(401).send("user are unothorised");
  }
  const uploadedImage = await uploadImage(req.file);
  if (!uploadedImage) {
    return res.status(201).send("uploadedImage are not found");
  }
  const avatar = uploadedImage.Location;

  const updatedUser = {
    avatar: avatar,
  };

  try {
    let user = await db.user.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user.user._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndDelete(userId);
  return res.send({ detail: "User Deleted" });
};

const deleteUserByAdmin = async (req, res) => {
  const userId = req.params.id;
  const user = await db.user.findById(userId);

  if (!user) {
    return res.status(500).send({ success: true, massage: "user not found" });
  }

  await user.remove();

  return res
    .status(200)
    .send({ success: true, massage: "User Deleted Successfull" });
};

// logOut user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await db.user.findById(req.user.user._id);
    if (!user) {
      return res.status(401).send({ success: true, massage: "User not found" });
    }
    user.token = null;
    await user.save();
    return res.status(200).send({ success: true, massage: "Logged Out User" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const forwordPassword = catchAsyncErrors(async (req, res, next) => {
  const findUser = await db.user.findOne({ username: req.body.username });
  if (!findUser) {
    return next(res.status(404).send("user not found"));
  }

  // get Reset Password Token

  const resetToken = findUser.getResetPasswordToken();

  await findUser.save({ validateBeforeSave: false });

  //Create reset password url
  const resetUrl = `http://localhost:5000/api/v1/reset/password/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this username, then please ignore.`;

  try {
    await sendMailler({
      username: findUser.username,
      subject: "Ecommerce Password Recovery",
      message,
    });
    return res.status(200).send({
      success: true,
      massage: `username sent to ${findUser.username}} successfully ${resetUrl}`,
    });
  } catch (error) {
    findUser.resetPasswordToken = undefined;
    findUser.resetPasswordExplre = undefined;

    await findUser.save({ validateBeforeSave: false });
    return next(res.status(500).send({ message: "username not send ", error }));
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
      res.status(404).send({
        message: "reset password token is invalid or has been expired",
        user,
      })
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
    return res.status(404).send({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  if (req.body.newPassword !== req.body.comfirmPassword) {
    return res.status(404).send("Password dose not match");
  }

  user.password = req.body.newPassword;

  var token = jwt.sign(user, config.jwt.jwtSecretKey);
  await user.save();
  return res.status(200).cookie("token", token).send({
    message: "User Password Updated",
    token: token,
    user: user,
  });
});

const updateUserRole = async (req, res, next) => {
  const username = req.body.username;
  const newRole = req.body.role;

  const user = await db.user.findOneAndUpdate(
    { username: username },
    { role: newRole }
  );
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  return res.status(200).send({
    message: "User role update succesfull ",
    success: true,
  });
};

const getUserDetails = async (req, res, next) => {
  try {
    let userId = req.user.user.id;
    const user = await db.user.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      role: user.role,
      avatar: user.avatar,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
    return res.status(200).json({
      success: true,
      user: userData,
      message: "user found success",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "user not found",
    });
  }
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
  getUserDetails,
  updateAvatar,
  deleteUserByAdmin,
};
