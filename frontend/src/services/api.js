import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://building-management-chi.vercel.app/api",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Token in localStorage:", token ? "exists" : "none");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Adding Authorization header");
    } else {
      console.log("❌ No token found - request will be unauthenticated");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log("🔄 401 Unauthorized - clearing token and redirecting to login");
      // Token expired or invalid, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("building");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;