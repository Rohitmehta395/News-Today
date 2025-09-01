// Backend/server.js (Updated with article routes and static files)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import suggestRoutes from "./routes/suggestRoutes.js";
import articleRoutes from "./routes/articleRoutes.js"; // ✅ New article routes

dotenv.config();

const app = express();

// ✅ Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS Configuration
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

app.use(express.json({ limit: "50mb" })); // ✅ Increased limit for images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/suggest", suggestRoutes);
app.use("/api/articles", articleRoutes); // ✅ New article routes

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ✅ DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
  }

  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Static files served from: ${uploadsDir}`);
});
