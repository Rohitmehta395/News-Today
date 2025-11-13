// Frontend/src/App.jsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateArticle from "./pages/CreateArticle.jsx";
import MyArticles from "./pages/MyArticles.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";

const NAV_CATEGORIES = [
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
  "general",
];

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header nav={NAV_CATEGORIES} />
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home nav={NAV_CATEGORIES} />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-article" element={<CreateArticle />} />
        <Route path="/edit-article/:id" element={<CreateArticle />} />
        <Route path="/my-articles" element={<MyArticles />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Route>
    </Routes>
  );
}
