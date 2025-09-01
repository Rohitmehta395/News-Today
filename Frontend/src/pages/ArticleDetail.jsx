// Frontend/src/pages/ArticleDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHeart,
  FaRegHeart,
  FaEye,
  FaCalendar,
  FaUser,
  FaTag,
} from "react-icons/fa";

export default function ArticleDetail() {
  const { id } = useParams();
  const { isAuthenticated, token, user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/articles/${id}`);

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setLikeCount(data.likeCount || 0);

        // Check if current user has liked this article
        if (isAuthenticated && user && data.likes) {
          setIsLiked(data.likes.includes(user.id));
        }
      } else {
        setError("Article not found");
      }
    } catch (err) {
      setError("Error loading article");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please login to like articles");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/articles/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Article not found</p>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && article.author._id === user.id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="bg-white rounded-lg shadow-sm">
        {/* Article Header */}
        <div className="p-6 border-b border-gray-200">
          {/* Category and Status */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {article.category.charAt(0).toUpperCase() +
                article.category.slice(1)}
            </span>
            {article.status === "draft" && (
              <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                Draft
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.description}
          </p>

          {/* Author and Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span className="font-medium text-gray-700">
                {article.authorName || article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              <span>
                {article.publishedAt
                  ? `Published ${formatDate(article.publishedAt)}`
                  : `Created ${formatDate(article.createdAt)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="w-4 h-4" />
              <span>{article.views || 0} views</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <FaTag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isLiked ? (
                <FaHeart className="w-4 h-4" />
              ) : (
                <FaRegHeart className="w-4 h-4" />
              )}
              <span>
                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
              </span>
            </button>

            {isAuthor && (
              <Link
                to={`/edit-article/${article._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Article
              </Link>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="p-6">
            <img
              src={`${API_BASE}${article.imageUrl}`}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="p-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Article Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(article.updatedAt)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {isLiked ? (
                  <FaHeart className="w-3 h-3" />
                ) : (
                  <FaRegHeart className="w-3 h-3" />
                )}
                Like
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Custom styles for article content */}
      <style jsx>{`
        .prose h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0;
        }
        .prose h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .prose h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .prose h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1em 0;
        }
        .prose p {
          margin: 1em 0;
          line-height: 1.6;
        }
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1em;
          border-radius: 0.375rem;
        }
        .prose pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: "Courier New", monospace;
          margin: 1em 0;
        }
        .prose ul,
        .prose ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1em 0;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #1d4ed8;
        }
        .prose strong {
          font-weight: bold;
        }
        .prose em {
          font-style: italic;
        }
        .prose u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
