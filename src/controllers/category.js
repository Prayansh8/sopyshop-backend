const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { db } = require("../db");

// Get all categories
const getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await db.category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

module.exports = {
  getCategories,
};
