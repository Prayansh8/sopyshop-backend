const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { signUp, signIn } = require("./controllers/user");
const {
  getUsers,
  getUser,
  getUserDetails,
  updateUser,
  logoutUser,
  forwordPassword,
  resetPassword,
  updatePassword,
  updateUserRole,
  deleteUser,
  deleteUserByAdmin,
  updateAvatar,
} = require("./controllers/userAuth");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createProductReviwe,
  getAllProductsReviews,
  deleteReviewes,
} = require("./controllers/product");
const cookieParser = require("cookie-parser");
const { isAuthenticatedUser, autherizeRoles } = require("./middlewere/auth");
const {
  newOrder,
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("./controllers/order");
const { toggleWishlist, getWishlist } = require("./controllers/wishlist");
const { processPayment, sendStripeApiKey } = require("./controllers/payment");
const cors = require("cors");
const { config } = require("./config");
const { upload } = require("./uploder/upload");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const userRouter = express.Router();
userRouter.post("/register", signUp);
userRouter.post("/get-token", signIn);

const userAuthRouter = express.Router();
userAuthRouter.get("/me", isAuthenticatedUser, getUserDetails);
userAuthRouter.patch("/me/update", isAuthenticatedUser, updateUser);
userAuthRouter.put(
  "/me/update/avatar",
  upload.single("avatar"),
  isAuthenticatedUser,
  updateAvatar
);
userAuthRouter.post("/logout", isAuthenticatedUser, logoutUser);
userAuthRouter.get("/users", isAuthenticatedUser, getUsers);
userAuthRouter.get("/user/:id", isAuthenticatedUser, getUser);
userAuthRouter.post("/reset/password", isAuthenticatedUser, forwordPassword);
userAuthRouter.put(
  "/reset/password/:token",
  isAuthenticatedUser,
  resetPassword
);
userAuthRouter.put("/password/update", isAuthenticatedUser, updatePassword);
userAuthRouter.patch(
  "/admin/update",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateUserRole
);
userAuthRouter.delete("/delete/user", isAuthenticatedUser, deleteUser);
userAuthRouter.delete(
  "/admin/delete/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteUserByAdmin
);

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

const productRouter = express.Router();
productRouter.post(
  "/product/new",
  upload.array("images"),
  isAuthenticatedUser,
  autherizeRoles("admin"),
  createProduct
);
productRouter.get(
  "/admin/products",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getAdminProducts
);
productRouter.get("/product/:id", getProduct);
productRouter.get("/products", getAllProducts);
productRouter.patch(
  "/product/update/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateProduct
);
productRouter.delete(
  "/product/delete/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteProduct
);
productRouter.put("/review", isAuthenticatedUser, createProductReviwe);
productRouter.get("/reviews", getAllProductsReviews);
productRouter.delete("/delete/review", isAuthenticatedUser, deleteReviewes);

const paymentRouter = express.Router();
paymentRouter.post("/payment/process", isAuthenticatedUser, processPayment);
paymentRouter.get("/stripeapikey", isAuthenticatedUser, sendStripeApiKey);

const orderRouter = express.Router();
orderRouter.post("/order/new", isAuthenticatedUser, newOrder);
orderRouter.get("/order/:id", isAuthenticatedUser, getSingleOrder);
orderRouter.get("/my/orders", isAuthenticatedUser, myOrders);
orderRouter.get(
  "/admin/orders",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  getAllOrders
);
orderRouter.put(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  updateOrder
);
orderRouter.delete(
  "/admin/order/:id",
  isAuthenticatedUser,
  autherizeRoles("admin"),
  deleteOrder
);

const wishlistRouter = express.Router();
wishlistRouter.post("/wishlist/toggle", isAuthenticatedUser, toggleWishlist);
wishlistRouter.get("/wishlist", isAuthenticatedUser, getWishlist);

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

app.use("/api/v1", userRouter);
app.use("/api/v1", userAuthRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", wishlistRouter);

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.baseUrl}:${config.port}`)
);
