require("dotenv").config();
const { config } = require("./config");
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Wishlist = require("./models/Wishlist");
const Category = require("./models/Category");
const Review = require("./models/Review");


const connect = async () => {
  const mongoUrl = config.mongo.url;
  try {
    // Disable command buffering so queries fail immediately if not connected
    mongoose.set('bufferCommands', false);

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000, 
    });
    console.log("✅ MongoDb Connected Successfully!!");
  } catch (error) {
    console.error("❌ MongoDb Connection Error:");
    console.error(error.message);
    
    if (error.message.includes("IP that isn't whitelisted") || error.message.includes("Could not connect to any servers")) {
      console.error("👉 ACTION REQUIRED: Your current IP is not whitelisted in MongoDB Atlas or the cluster is unreachable.");
      console.error("   1. Go to: https://www.mongodb.com/docs/atlas/security-whitelist/");
      console.error("   2. Add your current IP address to the whitelist.");
    }
    
    // Re-throw the error so the server startup knows it failed
    throw error;
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
