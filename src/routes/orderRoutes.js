const express = require("express");
const {
  newOrder,
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");
const { isAuthenticatedUser, autherizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/order/new", isAuthenticatedUser, newOrder);
router.get("/order/:id", isAuthenticatedUser, getSingleOrder);
router.get("/my/orders", isAuthenticatedUser, myOrders);

// Admin routes
router.get(
  "/admin/orders",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getAllOrders
);
router.put(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateOrder
);
router.delete(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteOrder
);

module.exports = router;
