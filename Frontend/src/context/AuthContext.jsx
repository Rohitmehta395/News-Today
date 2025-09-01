// src/context/AuthContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

// ✅ Use same API base everywhere
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // ✅ Sync state from storage
  const syncFromStorage = useCallback(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    try {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    } catch {
      setUser(null);
    }
  }, []);

  // ✅ Login
  const login = useCallback(
    ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      syncFromStorage();
      window.dispatchEvent(new Event("auth"));
    },
    [syncFromStorage]
  );

  // ✅ Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    syncFromStorage();
    window.dispatchEvent(new Event("auth"));
  }, [syncFromStorage]);

  // ✅ Fetch user info from backend when token exists
  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        logout(); // invalid/expired token
      }
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // ✅ Run once on mount to restore session
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ Listen to storage + custom "auth" events
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" || e.key === "user") syncFromStorage();
    };
    const onAuth = () => syncFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth", onAuth);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth", onAuth);
    };
  }, [syncFromStorage]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
