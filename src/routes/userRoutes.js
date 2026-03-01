const express = require("express");
const { signUp, signIn, googleLogin } = require("../controllers/user");
const {
  getUsers,
  getUser,
  getUserDetails,
  updateUser,
  logoutUser,
  updatePassword,
  updateUserRole,
  deleteUser,
  deleteUserByAdmin,
  updateAvatar,
  addShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
  forgotPassword,
  resetPassword,
} = require("../controllers/userAuth");
const { isAuthenticatedUser, autherizeRoles } = require("../middleware/auth");
const { upload } = require("../uploader/upload");

const router = express.Router();

// Public routes
router.post("/register", upload.none(), signUp);
router.post("/get-token", upload.none(), signIn);
router.post("/google/login", googleLogin);
router.post("/password/forgot", upload.none(), forgotPassword);
router.put("/password/reset/:token", upload.none(), resetPassword);

// User routes
router.get("/me", isAuthenticatedUser, getUserDetails);
router.patch("/me/update", isAuthenticatedUser, updateUser);
router.post("/me/shipping/add", isAuthenticatedUser, addShippingInfo);
router.patch("/me/shipping/update", isAuthenticatedUser, updateShippingInfo);
router.delete("/me/shipping/delete/:addressId", isAuthenticatedUser, deleteShippingInfo);
router.put("/me/update/avatar", upload.single("avatar"), isAuthenticatedUser, updateAvatar);
router.post("/logout", isAuthenticatedUser, logoutUser);
router.get("/user/:id", isAuthenticatedUser, getUser);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.delete("/delete/user", isAuthenticatedUser, deleteUser);

// Admin routes
router.get("/users", isAuthenticatedUser, autherizeRoles("admin"), getUsers);
router.patch("/admin/update/role", isAuthenticatedUser, autherizeRoles("admin"), updateUserRole);
router.delete("/admin/delete/:id", isAuthenticatedUser, autherizeRoles("admin"), deleteUserByAdmin);

module.exports = router;
