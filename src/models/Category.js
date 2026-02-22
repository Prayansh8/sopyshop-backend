const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    url: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);
