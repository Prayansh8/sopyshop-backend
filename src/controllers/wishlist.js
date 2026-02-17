const Wishlist = require("../databases/modals/Wishlist");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");

// Add / Remove from wishlist
exports.toggleWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
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
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

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
