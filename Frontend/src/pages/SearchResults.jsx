import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SearchResults() {
  const { query } = useParams(); // ✅ grab :query from URL
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchSearch = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/news/search/${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch results");
        const data = await res.json();

        // Some backends return {articles: []}, others []
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
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

      {loading && <p>🔄 Loading results...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && articles.length === 0 && <p>No results found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            {article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title || "News Image"}
                className="rounded mb-2 h-48 w-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 h-48 mb-2 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h3 className="font-bold mb-1">{article.title || "No title"}</h3>
            <p className="text-sm mb-2">
              {article.description
                ? article.description.slice(0, 120) + "..."
                : "No description available."}
            </p>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
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
