// src/controller/api.ts
import axios from 'axios';
import { forceLogout } from "../utils/logout";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach token if present (no JWT decoding)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // token do Sanctum é plainTextToken, não JWT — apenas anexa no header
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se backend retornar 401, força logout
    if (error.response?.status === 401) {
      try { forceLogout(); } catch (e) { console.error('Force logout falhou', e); }
    }
    return Promise.reject(error);
  }
);

export default api;
