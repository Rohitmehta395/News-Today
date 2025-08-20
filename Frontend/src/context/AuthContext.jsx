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

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const syncFromStorage = useCallback(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    try {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(
    ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      syncFromStorage();
      window.dispatchEvent(new Event("auth")); // notify other tabs/components
    },
    [syncFromStorage]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    syncFromStorage();
    window.dispatchEvent(new Event("auth"));
  }, [syncFromStorage]);

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
    () => ({ token, user, isAuthenticated: !!token, login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
