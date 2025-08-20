import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config"; // ✅ import central API base URL
import CategorySection from "../components/CategorySection";

export default function Home({ nav = [] }) {
  const categories = nav; // use same list as header
  const [newsData, setNewsData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const { data } = await axios.get(
              `${API_BASE_URL}/api/news/${cat}` // ✅ corrected endpoint
            );
            result[cat] = data.articles || [];
          } catch (err) {
            console.error(`Error fetching ${cat} news:`, err);
            result[cat] = [];
          }
        })
      );
      setNewsData(result);
      setLoading(false);
    })();
  }, [categories]);

  if (loading)
    return <p className="text-gray-600">Loading latest headlines…</p>;

  return (
    <>
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          title={cat[0].toUpperCase() + cat.slice(1)}
          articles={newsData[cat]}
        />
      ))}
    </>
  );
}
