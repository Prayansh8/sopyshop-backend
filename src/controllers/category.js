const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { db } = require("../db");
const { s3 } = require("../uploader/upload");
const { config } = require("../config");

// Get all categories
const getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await db.category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

// Create category -- Admin
const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, imageUrl } = req.body;
  
  const categoryData = { name };
  if (imageUrl) {
    categoryData.image = { url: imageUrl };
  }

  const category = await db.category.create(categoryData);

  res.status(201).json({
    success: true,
    category,
  });
});

// Update category -- Admin
const updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await db.category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const { name, imageUrl } = req.body;
  const updateData = { name };
  if (imageUrl !== undefined) {
    updateData.image = { url: imageUrl };
  }

  category = await db.category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, category });
});

// Delete category -- Admin
const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await db.category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  await category.deleteOne();

  res.status(200).json({ success: true, message: "Category Deleted Successfully" });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
