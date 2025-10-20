import express from "express";
import Sale from "../models/Sale.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const sales = await Sale.findAll();
  res.json(sales);
});

router.post("/", async (req, res) => {
  const sale = await Sale.create(req.body);
  res.json(sale);
});

export default router;
