import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import CategorySection from "../components/CategorySection";

export default function Category() {
  const { name } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/news/${name}`);
        setArticles(data.articles || []);
      } catch {
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
