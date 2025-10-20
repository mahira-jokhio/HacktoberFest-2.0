// ...existing code...
const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true, default: () => `INV-${Date.now()}` },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true, default: 0 },
      total: { type: Number, required: true, default: 0 }
    }
  ],
  subTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  customerName: { type: String },
  customerPhone: { type: String },
  paymentMethod: { type: String }, // Cash, Card, etc
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // cashier/admin id
  dueDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
// ...existing code...