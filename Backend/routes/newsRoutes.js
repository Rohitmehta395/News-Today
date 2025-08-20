import express from "express";
import { getNews, searchNews } from "../controllers/newsController.js";

const router = express.Router();

// GET news by category
router.get("/:category", getNews);

// ✅ Fix: use dynamic query
router.get("/search/:query", searchNews);

export default router;
