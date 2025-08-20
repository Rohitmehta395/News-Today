import axios from "axios";

export const getNews = async (req, res) => {
  try {
    const category = req.params.category || "general";

    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res.status(500).json({ message: "Error fetching news" });
  }
};

// 🔍 Search news by query
export const searchNews = async (req, res) => {
  try {
    const query = req.params.query; // ✅ matches /search/:query
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== "ok") {
      return res.status(400).json({ message: "Error fetching news", data });
    }

    res.json(data.articles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};