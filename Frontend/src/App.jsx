// Frontend/src/App.jsx (Updated with article routes)
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateArticle from "./pages/CreateArticle.jsx"; // ✅ New
import MyArticles from "./pages/MyArticles.jsx"; // ✅ New
import ArticleDetail from "./pages/ArticleDetail.jsx"; // ✅ New

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
    <>
      <Header nav={NAV_CATEGORIES} />
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ✅ Home route */}
        <Route path="/" element={<Home nav={NAV_CATEGORIES} />} />

        {/* ✅ Category route */}
        <Route path="/category/:name" element={<Category />} />

        {/* ✅ Search route */}
        <Route path="/search/:query" element={<SearchResults />} />

        {/* ✅ Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Article routes */}
        <Route path="/create-article" element={<CreateArticle />} />
        <Route path="/edit-article/:id" element={<CreateArticle />} />
        <Route path="/my-articles" element={<MyArticles />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Route>
    </Routes>
  );
}
