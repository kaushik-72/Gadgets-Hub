import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Backend Started");
});

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/orders',orderRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at :${PORT}`);
});
