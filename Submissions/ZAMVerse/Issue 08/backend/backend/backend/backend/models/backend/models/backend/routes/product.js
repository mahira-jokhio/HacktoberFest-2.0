import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

router.put("/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (product) {
    await product.update(req.body);
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (product) {
    await product.destroy();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

export default router;
