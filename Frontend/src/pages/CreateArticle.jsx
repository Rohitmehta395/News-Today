// Frontend/src/pages/CreateArticle.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RichTextEditor from "../components/RichTextEditor";
import { FaImage, FaSave, FaEye, FaTrash, FaSpinner } from "react-icons/fa";

const CATEGORIES = [
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
  "general",
];

export default function CreateArticle() {
  const { id } = useParams(); // For editing existing articles
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "general",
    tags: "",
    status: "draft",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load article for editing
  useEffect(() => {
    if (id && isAuthenticated) {
      setIsEditing(true);
      fetchArticle();
    }
  }, [id, isAuthenticated]);

  const fetchArticle = async () => {
    if (!id || !token) return;

    try {
      setInitialLoading(true);
      const response = await fetch(`${API_BASE}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const article = await response.json();

        // Check if user owns this article
        if (
          article.author._id !== JSON.parse(localStorage.getItem("user"))?.id
        ) {
          setError("You don't have permission to edit this article");
          return;
        }

        setFormData({
          title: article.title || "",
          description: article.description || "",
          content: article.content || "",
          category: article.category || "general",
          tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
          status: article.status || "draft",
        });

        if (article.imageUrl) {
          setImagePreview(`${API_BASE}${article.imageUrl}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to load article");
      }
    } catch (err) {
      console.error("Error loading article:", err);
      setError("Error loading article. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    setImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear any previous error
    if (error) setError("");
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      setError("Content is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e, publishNow = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", formData.tags.trim());

      // Set status based on action
      const status = publishNow ? "published" : formData.status;
      formDataToSend.append("status", status);

      // Add image if selected
      if (image) {
        formDataToSend.append("image", image);
      }

      const url = isEditing
        ? `${API_BASE}/api/articles/${id}`
        : `${API_BASE}/api/articles`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to My Articles
        navigate("/my-articles", {
          state: {
            message: isEditing
              ? `Article "${formData.title}" updated successfully!`
              : `Article "${formData.title}" created successfully!`,
          },
        });
      } else {
        setError(data.message || "Failed to save article");
      }
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${formData.title}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/my-articles", {
          state: { message: "Article deleted successfully!" },
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete article");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  // Show loading spinner while fetching article for editing
  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin w-8 h-8 mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h1>
              {isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaTrash className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>

        <form className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title"
              required
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Brief description of your article (this will appear in previews)"
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Category and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="technology, programming, web (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, GIF, WebP up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your article content here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <FaSpinner className="animate-spin w-4 h-4" />
              ) : (
                <FaSave className="w-4 h-4" />
              )}
              {loading ? "Saving..." : "Save as Draft"}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <FaSpinner className="animate-spin w-4 h-4" />
              ) : (
                <FaEye className="w-4 h-4" />
              )}
              {loading ? "Publishing..." : "Publish Now"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/my-articles")}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
