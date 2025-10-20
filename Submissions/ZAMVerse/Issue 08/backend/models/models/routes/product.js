import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post("/", async (req, res) => {
  const { name, sku, category, price, quantity } = req.body;
  try {
    const newProduct = await Product.create({ name, sku, category, price, quantity });
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});

export default router;
