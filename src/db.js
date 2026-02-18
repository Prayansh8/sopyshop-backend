const { config } = require("./config");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Wishlist = require("./models/Wishlist");
const Category = require("./models/Category");
const Review = require("./models/Review");

dotenv.config();

const connect = async () => {
  const mongoUrl = config.mongo.url;
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDb Connected Successfully!!");
  } catch (error) {
    console.error("❌ MongoDb Connection Error:");
    console.error(error.message);
    // If you want to see the full error for debugging, uncomment the next line
    // console.error(error);
  }
};




const db = {
  user: User,
  product: Product,
  order: Order,
  wishlist: Wishlist,
  category: Category,
  review: Review
};

module.exports = { connect, db };
