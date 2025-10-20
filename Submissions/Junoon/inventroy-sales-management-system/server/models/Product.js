const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
