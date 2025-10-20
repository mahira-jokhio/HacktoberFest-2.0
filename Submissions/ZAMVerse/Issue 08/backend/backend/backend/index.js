import express from "express";
import productRoutes from "./routes/product.js";

const app = express();
const PORT = 5000;

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
