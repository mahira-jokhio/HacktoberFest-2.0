import mongoose from "mongoose"

const stockAlertSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    currentQuantity: Number,
    threshold: Number,
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  { timestamps: true },
)

export default mongoose.models.StockAlert || mongoose.model("StockAlert", stockAlertSchema)
