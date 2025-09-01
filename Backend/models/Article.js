// Backend/models/Article.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "business",
        "technology",
        "sports",
        "entertainment",
        "health",
        "science",
        "general",
      ],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for like count
articleSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Index for better search performance
articleSchema.index({ title: "text", content: "text", description: "text" });
articleSchema.index({ author: 1, createdAt: -1 });
articleSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model("Article", articleSchema);
