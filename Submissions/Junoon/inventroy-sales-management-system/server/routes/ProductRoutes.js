const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});

router.post('/add-product', async (req, res) => {
  try {
    const { name, sku, category, price, stock, image, description } = req.body;

    if (!name || !sku || price == null || stock == null) {
      return res.status(400).json({ success: false, message: 'name, sku, price and stock are required' });
    }

    // prevent duplicate SKU
    const existing = await Product.findOne({ sku });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Product with this SKU already exists' });
    }

    const product = await Product.create({ name, sku, category, price, stock, image, description });
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate field value', error: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate field value', error: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});


module.exports = router;
