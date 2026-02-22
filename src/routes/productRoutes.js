const express = require("express");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
} = require("../controllers/product");
const { isAuthenticatedUser, autherizeRoles } = require("../middleware/auth");
const { upload } = require("../uploader/upload");

const router = express.Router();

// Public routes
router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
router.get("/reviews", getAllProductsReviews);

// User routes
router.put("/review", isAuthenticatedUser, createProductReviwe);
router.delete("/delete/review", isAuthenticatedUser, deleteReviewes);

// Admin routes
router.post(
  "/admin/product/new",
  upload.array("images"),
  isAuthenticatedUser,
  autherizeRoles("admin"),
  createProduct
);
router.get(
  "/admin/products",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getAdminProducts
);
router.patch(
  "/admin/product/update/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/delete/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteProduct
);

module.exports = router;
