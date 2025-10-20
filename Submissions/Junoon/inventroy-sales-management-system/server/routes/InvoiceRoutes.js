const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

router.post("/add-invoice", async (req, res) => {
    try {
        // Accept all possible invoice fields
        const {
            invoiceNumber,
            customerName,
            customerPhone,
            items: rawItems,
            subTotal,
            tax,
            discount,
            grandTotal,
            total,
            paymentMethod,
            status,
            date,
            createdBy,
            dueDate,
            notes
        } = req.body;

        // Ensure item name is set from Product if missing
        const items = await Promise.all((rawItems || []).map(async item => {
            if ((!item.name || item.name === "Unnamed") && item.productId) {
                const prod = await require('../models/Product').findById(item.productId);
                return {
                    ...item,
                    name: prod ? prod.name : "Unnamed"
                };
            }
            return item;
        }));

        // Validate required fields
        if (!invoiceNumber || !customerName || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "invoiceNumber, customerName and at least 1 item are required"
            });
        }

        // Prevent duplicate invoice number
        const existingInvoice = await Invoice.findOne({ invoiceNumber });
        if (existingInvoice) {
            return res.status(409).json({
                success: false,
                message: "Invoice with this number already exists"
            });
        }

        // Calculate subTotal, tax, discount, grandTotal if not provided
        let calcSubTotal = subTotal;
        if (typeof calcSubTotal !== 'number') {
            calcSubTotal = items.reduce((sum, item) => sum + (item.total || (item.price * item.quantity)), 0);
        }
        let calcTax = typeof tax === 'number' ? tax : 0;
        let calcDiscount = typeof discount === 'number' ? discount : 0;
        let calcGrandTotal = grandTotal;
        if (typeof calcGrandTotal !== 'number') {
            calcGrandTotal = calcSubTotal + calcTax - calcDiscount;
        }

        // Create Invoice with all fields
        const invoice = await Invoice.create({
            invoiceNumber,
            customerName,
            customerPhone,
            items,
            subTotal: calcSubTotal,
            tax: calcTax,
            discount: calcDiscount,
            grandTotal: calcGrandTotal,
            total: calcGrandTotal,
            paymentMethod,
            status,
            date: date || new Date(),
            createdBy,
            dueDate,
            notes
        });

        return res.status(201).json({ success: true, data: invoice });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let updates = req.body;
        // Ensure item name is set from Product if missing
        if (updates.items && Array.isArray(updates.items)) {
            updates.items = await Promise.all(updates.items.map(async item => {
                if ((!item.name || item.name === "Unnamed") && item.productId) {
                    const prod = await require('../models/Product').findById(item.productId);
                    return {
                        ...item,
                        name: prod ? prod.name : "Unnamed"
                    };
                }
                return item;
            }));
        }
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Duplicate field value', error: error.message });
        }
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'invoice not found' });
        }

        return res.status(200).json({ success: true, message: 'invoice deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});


module.exports = router;
