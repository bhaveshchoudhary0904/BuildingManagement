import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./authContextValue";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const buildingData = localStorage.getItem("building");
        const building = buildingData ? JSON.parse(buildingData) : null;

        setUser({ ...response.data.data, building });
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("building");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login with:", email);
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", response.data);
      const { token, user, building } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("building", JSON.stringify(building));

      console.log("💾 Token stored in localStorage");
      setToken(token);
      setUser({ ...user, building });

      return {
        success: true,
        user: { ...user, building },
        building,
      };
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("building");

    setToken(null);
    setUser(null);
  };

  const hasRole = (roleId) => {
    return user?.role_id === roleId;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hasRole,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
