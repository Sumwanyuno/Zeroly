import axios from "axios";

const API_BASE =
  import.meta.env.PROD
    ? "https://zeroly-production.up.railway.app/api"  // Railway backend
    : "http://localhost:5001/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;
