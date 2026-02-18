const mongoose = require("mongoose");
const { Schema } = mongoose;
const { addressSchema, orderItemSchema } = require("./SubSchemas");

const OrderSchema = new Schema({
  shippingInfo: addressSchema,
  orderItems: [orderItemSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: [true, "Payment ID is required"],
    },
    status: {
      type: String,
      required: [true, "Payment status is required"],
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"]
  },
  deliveredAt: { type: Date },
}, {
  timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
