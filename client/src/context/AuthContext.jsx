import { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("edumind_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Session validation failed:", err);
        // Clear corrupt storage
        localStorage.removeItem("edumind_token");
        localStorage.removeItem("edumind_user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      localStorage.setItem("edumind_token", userData.token);
      localStorage.setItem("edumind_user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const userData = await authAPI.register(name, email, password);
      setUser(userData);
      localStorage.setItem("edumind_token", userData.token);
      localStorage.setItem("edumind_user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edumind_token");
    localStorage.removeItem("edumind_user");
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
