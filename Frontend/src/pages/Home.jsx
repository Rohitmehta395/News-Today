// Frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CategorySection from "../components/CategorySection";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaPlus, FaUser } from "react-icons/fa";

export default function Home({ nav = [] }) {
  const categories = nav;
  const { isAuthenticated } = useAuth();
  const [newsData, setNewsData] = useState({});
  const [userArticles, setUserArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchNews();
    if (isAuthenticated) {
      fetchUserArticles();
    }
  }, [categories, isAuthenticated]);

  const fetchNews = async () => {
    setLoading(true);
    const result = {};
    await Promise.all(
      categories.map(async (cat) => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/news/${cat}`);
          result[cat] = data.articles || [];
        } catch (err) {
          console.error(`Error fetching ${cat} news:`, err);
          result[cat] = [];
        }
      })
    );
    setNewsData(result);
    setLoading(false);
  };

  const fetchUserArticles = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/articles?status=published`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserArticles(data.articles.slice(0, 6));
      }
    } catch (err) {
      console.error("Error fetching user articles:", err);
    }
  };

  const UserArticleCard = ({ article }) => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
      {article.imageUrl ? (
        <img
          src={`${API_BASE}${article.imageUrl}`}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <FaUser className="text-white text-4xl" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
            Community
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {article.category}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
          {article.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>By {article.authorName}</span>
            <span>•</span>
            <span>{article.views || 0} views</span>
          </div>
          <Link
            to={`/article/${article._id}`}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Loading latest headlines…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner for Authenticated Users */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Share Your Story</h2>
              <p className="text-blue-100">
                Create and publish your own articles for the community to read.
              </p>
            </div>
            <Link
              to="/create-article"
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors mt-4 sm:mt-0 font-semibold shadow-md hover:shadow-lg"
            >
              <FaPlus className="w-4 h-4" />
              Create Article
            </Link>
          </div>
        </div>
      )}

      {/* User Articles Section */}
      {userArticles.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Community Articles
            </h2>
            <Link
              to="/community"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {userArticles.map((article) => (
              <UserArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Join Our Community
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign up to create and share your own articles with our community.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      {/* News Categories */}
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          title={cat[0].toUpperCase() + cat.slice(1) + " News"}
          articles={newsData[cat]}
        />
      ))}
    </div>
  );
}
