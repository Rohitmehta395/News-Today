// Frontend/src/pages/Category.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import CategorySection from "../components/CategorySection";

export default function Category() {
  const { name } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/news/${name}`);
        setArticles(data.articles || []);
      } catch (err) {
        console.error(`Error fetching ${name} news:`, err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  return (
    <>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Loading {name}…
          </p>
        </div>
      ) : (
        <CategorySection
          title={name[0].toUpperCase() + name.slice(1)}
          articles={articles}
        />
      )}
    </>
  );
}
