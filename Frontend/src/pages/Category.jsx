import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config"; // ✅ import central API base URL
import CategorySection from "../components/CategorySection";

export default function Category() {
  const { name } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/news/${name}` // ✅ corrected endpoint
        );
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
        <p className="text-gray-600">Loading {name}…</p>
      ) : (
        <CategorySection
          title={name[0].toUpperCase() + name.slice(1)}
          articles={articles}
        />
      )}
    </>
  );
}
