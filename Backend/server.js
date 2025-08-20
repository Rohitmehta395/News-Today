import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Configure CORS (only allow your frontend)
const allowedOrigins = [
  "http://localhost:5173", // for local dev (Vite default)
  "https://news-today.vercel.app", // replace with your actual Vercel domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);

// ✅ DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
