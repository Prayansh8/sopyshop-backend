const express = require("express");
const { toggleWishlist, getWishlist } = require("../controllers/wishlist");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.post("/wishlist/toggle", isAuthenticatedUser, toggleWishlist);
router.get("/wishlist", isAuthenticatedUser, getWishlist);

module.exports = router;
