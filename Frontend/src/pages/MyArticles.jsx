// Frontend/src/pages/MyArticles.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaHeart,
  FaCalendar,
} from "react-icons/fa";

export default function MyArticles() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, draft, published
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchArticles();
  }, [isAuthenticated, filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== "all" ? `?status=${filter}` : "";
      const response = await fetch(
        `${API_BASE}/api/articles/user/my-articles${statusParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        setError("Failed to fetch articles");
      }
    } catch (err) {
      setError("Error loading articles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArticles(articles.filter((article) => article._id !== id));
      } else {
        setError("Failed to delete article");
      }
    } catch (err) {
      setError("Error deleting article");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          badges[status] || badges.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          My Articles
        </h1>
        <Link
          to="/create-article"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Create Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "draft", "published"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
                  {articles.filter((a) => a.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading your articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4">
            <FaEdit className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No articles yet
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === "all"
              ? "Start writing your first article!"
              : `No ${filter} articles found.`}
          </p>
          <Link
            to="/create-article"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Create Your First Article
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Article Image */}
                {article.imageUrl && (
                  <div className="lg:w-48 lg:flex-shrink-0">
                    <img
                      src={`${API_BASE}${article.imageUrl}`}
                      alt={article.title}
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(article.status)}
                      <span className="text-xs text-gray-500 capitalize">
                        {article.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendar className="w-3 h-3" />
                      {formatDate(article.updatedAt)}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaEye className="w-4 h-4" />
                      {article.views || 0} views
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHeart className="w-4 h-4" />
                      {article.likeCount || 0} likes
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{article.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/article/${article._id}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                    >
                      <FaEye className="w-3 h-3" />
                      View
                    </Link>
                    <Link
                      to={`/edit-article/${article._id}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      <FaEdit className="w-3 h-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                    >
                      <FaTrash className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
