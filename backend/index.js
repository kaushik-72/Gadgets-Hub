import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Started");
});

app.use('/api/auth',authRoutes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at :${PORT}`);
});
