import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routers/auth.route.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // React Frontend URL

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
