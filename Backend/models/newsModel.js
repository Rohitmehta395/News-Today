// backend/models/newsModel.js
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    url: { type: String },
    imageUrl: { type: String },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
export default News;
