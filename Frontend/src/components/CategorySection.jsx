// Frontend/src/components/CategorySection.jsx
import React from "react";
import NewsCard from "./NewsCard";

export default function CategorySection({ title, articles }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {articles && articles.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No articles available.
        </p>
      )}
    </section>
  );
}
