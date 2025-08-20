import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import SearchResults from "./pages/SearchResults.jsx"; // ✅ import search page

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
        {/* ✅ Login route */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* ✅ Register route */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Route>
    </Routes>
  );
}
