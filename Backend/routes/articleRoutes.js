// Backend/routes/articleRoutes.js
import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  getUserArticles,
  updateArticle,
  deleteArticle,
  toggleLike,
  upload,
} from "../controllers/articleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getArticles); // Get all published articles
router.get("/:id", getArticleById); // Get single article by ID

// Protected routes (require authentication)
router.post("/", authMiddleware, upload.single("image"), createArticle); // Create article
router.get("/user/my-articles", authMiddleware, getUserArticles); // Get user's articles
router.put("/:id", authMiddleware, upload.single("image"), updateArticle); // Update article
router.delete("/:id", authMiddleware, deleteArticle); // Delete article
router.post("/:id/like", authMiddleware, toggleLike); // Like/unlike article

export default router;
