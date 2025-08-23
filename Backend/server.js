import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import suggestRoutes from "./routes/suggestRoutes.js"; // ✅ Import suggest route

dotenv.config();

const app = express();

// ✅ Allowed origins (patterns instead of exact match)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      // ✅ Allow any vercel.app subdomain
      if (
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost:3000") ||
        origin.startsWith("http://localhost:5173")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/suggest", suggestRoutes); // ✅ Autocomplete API

// ✅ DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
