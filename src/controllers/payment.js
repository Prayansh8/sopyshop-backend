const { config } = require("../config");
const stripe = require("stripe")(config.stripe.stripeSecret);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const processPayment = catchAsyncErrors(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount, 
    currency: "inr",
    description: "Sopyshop E-commerce Purchase",
    payment_method_types: ["card"],
  });

  res.status(200).json({ 
    success: true, 
    clientSecret: paymentIntent.client_secret 
  });
});

const sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripeApiKey: config.stripe.stripeKey,
  });
});

module.exports = { processPayment, sendStripeApiKey };
