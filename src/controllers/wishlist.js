const { db } = require("../db");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Add / Remove from wishlist
exports.toggleWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.user.id || req.user.user._id;
  let wishlist = await db.wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await db.wishlist.create({
      user: userId,
      products: [productId],
    });
    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  }

  const isExist = wishlist.products.includes(productId);

  if (isExist) {
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    await wishlist.save();
    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } else {
    wishlist.products.push(productId);
    await wishlist.save();
    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  }
});

// Get user wishlist
exports.getWishlist = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.user.id || req.user.user._id;
  const wishlist = await db.wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      products: [],
    });
  }

  res.status(200).json({
    success: true,
    products: wishlist.products,
  });
});
