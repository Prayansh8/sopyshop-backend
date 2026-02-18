const { db } = require("../db");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await db.order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await db.order
    .findById(req.params.id)
    .populate("user", "firstName lastName email");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user Orders
const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await db.order.find({ user: req.user.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await db.order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order Status -- Admin
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await db.order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.orderStatus === "Delivered") {
    return res.status(400).json({ success: false, message: "This order has already been delivered" });
  }

  if (req.body.status === "Shipped") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order
  });
});

async function updateStock(id, quantity) {
  const product = await db.product.findById(id);
  if (product) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
}

// Delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await db.order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  });
});

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
