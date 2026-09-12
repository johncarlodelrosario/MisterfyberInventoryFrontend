import axios from "axios";

// ============================================================
// API URL CONFIGURATION
// ------------------------------------------------------------
// Production → https://misterfyberinventorybackend.onrender.com/api
// Local dev  → http://localhost:5000/api
// ============================================================

const PRODUCTION_API_URL =
  "https://misterfyberinventorybackend.onrender.com/api";
const LOCAL_API_URL = "http://localhost:5000/api";

const API_URL =
  process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : LOCAL_API_URL;

console.log(`🔗 API URL: ${API_URL}`);
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60s (Render free tier can cold-start in ~30-50s)
});

// ============================================================
// REQUEST INTERCEPTOR — Attach JWT Token
// ============================================================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ============================================================
// RESPONSE INTERCEPTOR — Handle Errors
// ============================================================
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);

    if (typeof window !== "undefined") {
      // Handle 401 Unauthorized — clear token and redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      // Handle network / cold-start errors (Render free tier)
      if (
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout") ||
        !error.response
      ) {
        console.warn(
          "⏳ Backend may be cold-starting (Render free tier). Please retry in 30–60 seconds.",
        );
      }
    }
    return Promise.reject(error);
  },
);

export default api;
