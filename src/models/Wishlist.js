const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
}, {
  timestamps: true,
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
