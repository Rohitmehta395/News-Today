// Frontend/src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

export default function SearchResults() {
  const { query } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchSearch = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/news/search/${encodeURIComponent(query)}`
        );
        setArticles(data.articles || data || []);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
        setError("Something went wrong while fetching results.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Search Results for "{query}"
      </h2>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading results...
          </p>
        </div>
      )}

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No results found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title || "News Image"}
                className="rounded mb-2 h-48 w-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-48 mb-2 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded">
                No Image
              </div>
            )}

            <h3 className="font-bold mb-1 text-gray-900 dark:text-white">
              {article.title || "No title"}
            </h3>
            <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
              {article.description
                ? article.description.slice(0, 120) + "..."
                : "No description available."}
            </p>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Read More →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
