// src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "./endpoints";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default api;