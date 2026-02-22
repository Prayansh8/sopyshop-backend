const ApiFeatures = require("../utils/ApiFeatures");
const { db } = require("../db");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { s3 } = require("../uploader/upload");
const { config } = require("../config");

// create product -- Admin
const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const userId = req.user.user._id;

  const uploadImages = Promise.all(
    (req.files || []).map(async (file) => {
      const params = {
        Bucket: config.aws.awsBucketName,
        Key: `products/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const result = await s3.upload(params).promise();
      return result.Location;
    })
  );

  let images = (await uploadImages).map((url) => ({ url }));

  // Also support direct linked image URLs from formData
  if (req.body.imageUrls) {
     try {
       const parsedUrls = typeof req.body.imageUrls === 'string' 
         ? JSON.parse(req.body.imageUrls) 
         : req.body.imageUrls;
       
       if (Array.isArray(parsedUrls)) {
         const urlObjects = parsedUrls.map(url => ({ url }));
         images = [...images, ...urlObjects];
       }
     } catch (e) {
       console.log("Could not parse imageUrls", e);
     }
  }

  const product = await db.product.create({
    name,
    description,
    price: Number(price),
    images,
    stock: Number(stock),
    category,
    user: userId,
  });

  res.status(201).json({ success: true, product });
});

// get all products
const getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = parseInt(req.query.limit) || 8;
  const productsCount = await db.product.countDocuments();
  
  const queryCopy = { ...req.query };

  // Resolve category name to ID
  if (queryCopy.category && typeof queryCopy.category === 'string' && !queryCopy.category.match(/^[0-9a-fA-F]{24}$/)) {
    const categoryName = queryCopy.category;
    const category = await db.category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });
    
    if (category) {
      queryCopy.category = category._id.toString();
    } else {
      queryCopy.category = "000000000000000000000000";
    }
  }

  const features = new ApiFeatures(db.product.find(), queryCopy)
    .filter()
    .search()
    .category()
    .price()
    .sort()
    .paginate(resultPerPage);

  const products = await features.query.populate("category");
  
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    results: products.length,
  });
});

// get single product
const getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await db.product.findById(req.params.id).populate("reviews category");

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

// get admin products
const getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await db.product.find().populate("category");
  res.status(200).json({ success: true, products });
});

const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await db.product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const updateData = { ...req.body };
  if (updateData.price) updateData.price = Number(updateData.price);
  if (updateData.stock) updateData.stock = Number(updateData.stock);
  
  // Also support direct linked image URLs from formData
  if (req.body.imageUrls) {
     try {
       const parsedUrls = typeof req.body.imageUrls === 'string' 
         ? JSON.parse(req.body.imageUrls) 
         : req.body.imageUrls;
         
       if (Array.isArray(parsedUrls)) {
         updateData.images = parsedUrls.map(url => ({ url }));
       }
     } catch (e) {
       console.log("Could not parse imageUrls", e);
     }
  }

  product = await db.product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category");

  res.status(200).json({ success: true, product });
});

// Delete Product -- Admin
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await db.product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product Deleted Successfully" });
});

// Create/Update Review
const createProductReviwe = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user.user._id;

  const reviewData = {
    user: userId,
    product: productId,
    name: `${req.user.user.firstName} ${req.user.user.lastName}`,
    rating: Number(rating),
    comment,
  };

  const product = await db.product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  let review = await db.review.findOne({ user: userId, product: productId });

  if (review) {
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    await db.review.create(reviewData);
  }

  // Update product aggregation
  const reviews = await db.review.find({ product: productId });
  product.numOfReviews = reviews.length;
  product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review added successfully" });
});

// Get All Reviews of a product
const getAllProductsReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await db.review.find({ product: req.query.id }).populate("user", "firstName lastName avatar");
  res.status(200).json({ success: true, reviews });
});

// Delete Review
const deleteReviewes = catchAsyncErrors(async (req, res, next) => {
  const review = await db.review.findById(req.query.id);
  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  const productId = review.product;
  await review.deleteOne();

  // Update product aggregation
  const product = await db.product.findById(productId);
  const reviews = await db.review.find({ product: productId });
  
  product.numOfReviews = reviews.length;
  product.ratings = reviews.length > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
    : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review deleted successfully" });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
};
