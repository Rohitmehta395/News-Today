// backend/routes/suggestRoutes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Trie from "../utils/trie.js";
import News from "../models/newsModel.js";

const router = express.Router();

// ✅ Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create Trie
const trie = new Trie();

// ✅ Load dictionary into Trie
const loadDictionary = () => {
  try {
    const filePath = path.resolve(__dirname, "../data/words_alpha.txt"); // 🔑 safer than join
    const words = fs.readFileSync(filePath, "utf-8").split("\n");

    let count = 0;
    words.forEach((word) => {
      const cleanWord = word.trim();
      if (cleanWord) {
        trie.insert(cleanWord);
        count++;
      }
    });

    console.log(`✅ Loaded ${count} words into Trie`);
  } catch (err) {
    console.error("❌ Error loading dictionary:", err.message);
  }
};
loadDictionary();

// ✅ Suggest API
router.get("/", async (req, res) => {
  const query = (req.query.q || "").trim();
  if (!query) return res.json([]);

  try {
    // 1️⃣ Dictionary suggestions
    const dictSuggestions = trie.searchPrefix(query, 10);

    // 2️⃣ MongoDB suggestions (article titles)
    const mongoSuggestions = await News.find(
      { title: { $regex: `^${query}`, $options: "i" } },
      { title: 1, _id: 0 }
    )
      .limit(5)
      .lean();

    const mongoTitles = mongoSuggestions.map((item) => item.title);

    // 3️⃣ Merge & remove duplicates
    const combined = [...new Set([...dictSuggestions, ...mongoTitles])];

    res.json(combined.slice(0, 10));
  } catch (error) {
    console.error("❌ Suggestion Error:", error.message);
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
});

export default router;
