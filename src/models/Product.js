const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { 
    type: String, 
    required: [true, "Please Enter the Product Name"],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, "Please Enter the Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter the Product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  images: [
    {
      url: String,
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Please enter product category"],
    index: true
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: 5,
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews - allows us to populate reviews without storing them in the array
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
