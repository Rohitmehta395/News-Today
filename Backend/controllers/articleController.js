// Backend/controllers/articleController.js
import Article from "../models/Article.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Create a new article
export const createArticle = async (req, res) => {
  try {
    const { title, description, content, category, tags, status } = req.body;

    if (!title || !description || !content || !category) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const articleData = {
      title,
      description,
      content,
      category,
      author: req.user.id,
      authorName: req.user.name,
      status: status || "draft",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    };

    if (req.file) {
      articleData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (status === "published") {
      articleData.publishedAt = new Date();
    }

    const article = new Article(articleData);
    await article.save();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all articles (with filtering)
export const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      author,
      status = "published",
      search,
    } = req.query;

    const filter = { status };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (author) {
      filter.author = author;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const articles = await Article.find(filter)
      .populate("author", "name email")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(filter);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's own articles (drafts and published)
export const getUserArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { author: req.user.id };
    if (status) {
      filter.status = status;
    }

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(filter);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get user articles error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user owns the article
    if (article.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this article" });
    }

    const { title, description, content, category, tags, status } = req.body;

    // Update fields
    if (title) article.title = title;
    if (description) article.description = description;
    if (content) article.content = content;
    if (category) article.category = category;
    if (tags) article.tags = tags.split(",").map((tag) => tag.trim());
    if (status) {
      article.status = status;
      if (status === "published" && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    if (req.file) {
      article.imageUrl = `/uploads/${req.file.filename}`;
    }

    await article.save();

    res.json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user owns the article
    if (article.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this article" });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike article
export const toggleLike = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const userLikedIndex = article.likes.indexOf(req.user.id);

    if (userLikedIndex > -1) {
      // Unlike
      article.likes.splice(userLikedIndex, 1);
    } else {
      // Like
      article.likes.push(req.user.id);
    }

    await article.save();

    res.json({
      success: true,
      liked: userLikedIndex === -1,
      likeCount: article.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: error.message });
  }
};
