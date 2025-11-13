// Frontend/src/components/NewsCard.jsx
import React from "react";

export default function NewsCard({ article }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
      {article.urlToImage ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
          {article.description}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline text-sm font-medium inline-flex items-center gap-1 transition-colors"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}
