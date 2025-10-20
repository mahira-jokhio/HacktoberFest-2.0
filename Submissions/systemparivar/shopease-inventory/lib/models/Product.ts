import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },
    sku: {
      type: String,
      required: [true, "Please provide a SKU"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    description: String,
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    image: String,
    imageUrl: String,
    barcode: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model("Product", productSchema)
