const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { config } = require("./config");
const { connect } = require("./db");

const app = express();

// Connect Database
connect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const errorMiddleware = require("./middleware/errorHandler");

// Use Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", wishlistRoutes);
app.use("/api/v1", categoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Sopyshop API is running');
});

// Error Middleware
app.use(errorMiddleware);

app.listen(config.port, () =>
  console.log(`Server is running on ${config.baseUrl}:${config.port}`)
);

module.exports = app;
