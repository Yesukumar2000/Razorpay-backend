import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
