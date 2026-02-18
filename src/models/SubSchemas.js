const mongoose = require("mongoose");

// Address Schema for reuse in Orders and potentially User profile
const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Please Enter Your address"],
  },
  city: {
    type: String,
    required: [true, "Please Enter Your city"],
  },
  state: {
    type: String,
    required: [true, "Please Enter Your state"],
  },
  country: {
    type: String,
    required: [true, "Please Enter Your country"],
    default: "India"
  },
  pinCode: {
    type: Number,
    required: [true, "Please Enter Your pinCode"],
  },
  phone: {
    type: Number,
    required: [true, "Please Enter Your phone"],
  }
});

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product price"],
  },
  quantity: {
    type: Number,
    required: [true, "Please Enter quantity"],
  },
  image: {
    type: String,
    required: [true, "Please Enter image URL"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  }
});

module.exports = {
  addressSchema,
  orderItemSchema
};
