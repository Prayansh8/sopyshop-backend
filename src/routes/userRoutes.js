const express = require("express");
const { signUp, signIn } = require("../controllers/user");
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
} = require("../controllers/userAuth");
const { isAuthenticatedUser, autherizeRoles } = require("../middleware/auth");
const { upload } = require("../uploader/upload");

const router = express.Router();

// Public routes
router.post("/register", signUp);
router.post("/get-token", signIn);

// User routes
router.get("/me", isAuthenticatedUser, getUserDetails);
router.patch("/me/update", isAuthenticatedUser, updateUser);
router.put("/me/update/avatar", upload.single("avatar"), isAuthenticatedUser, updateAvatar);
router.post("/logout", isAuthenticatedUser, logoutUser);
router.get("/user/:id", isAuthenticatedUser, getUser);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.delete("/delete/user", isAuthenticatedUser, deleteUser);

// Admin routes
router.get("/admin/users", isAuthenticatedUser, autherizeRoles("admin"), getUsers);
router.patch("/admin/update/role", isAuthenticatedUser, autherizeRoles("admin"), updateUserRole);
router.delete("/admin/delete/user/:id", isAuthenticatedUser, autherizeRoles("admin"), deleteUserByAdmin);

module.exports = router;
