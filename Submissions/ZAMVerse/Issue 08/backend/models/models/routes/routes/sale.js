import express from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sales = await Sale.findAll();
  res.json(sales);
});

router.post("/", async (req, res) => {
  const { productName, quantitySold } = req.body;

  try {
    const product = await Product.findOne({ where: { name: productName } });

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantity < quantitySold)
      return res.status(400).json({ message: "Not enough stock available" });

    const totalAmount = product.price * quantitySold;

    product.quantity -= quantitySold;
    await product.save();

    await Sale.create({ productName, quantitySold, totalAmount });

    res.json({ message: "Sale recorded successfully", totalAmount });
  } catch (err) {
    res.status(500).json({ message: "Error recording sale", error: err.message });
  }
});

export default router;
