const express = require("express");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category");
const { isAuthenticatedUser, autherizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/categories").get(getCategories);

router.route("/admin/category/new").post(isAuthenticatedUser, autherizeRoles("admin"), createCategory);
router.route("/admin/category/:id")
  .put(isAuthenticatedUser, autherizeRoles("admin"), updateCategory)
  .delete(isAuthenticatedUser, autherizeRoles("admin"), deleteCategory);

module.exports = router;
