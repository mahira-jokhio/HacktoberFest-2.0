import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import productRoutes from "./routes/product.js";
import saleRoutes from "./routes/sale.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

// Start server after DB sync
sequelize.sync()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
