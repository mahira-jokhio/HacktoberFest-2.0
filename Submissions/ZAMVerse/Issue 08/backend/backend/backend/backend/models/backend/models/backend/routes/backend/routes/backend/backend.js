import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import productRoutes from "./routes/product.js";
import saleRoutes from "./routes/sale.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

sequelize.sync();
app.listen(5000, () => console.log("✅ Server running on port 5000"));
