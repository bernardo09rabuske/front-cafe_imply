import axios from 'axios';
import { jwtDecode } from "jwt-decode"
import { forceLogout } from "../utils/logout";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          forceLogout();
          return Promise.reject("Token expirado");
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        forceLogout();
        return Promise.reject("Token inválido");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,

  (error) => {
    if (error.response?.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);


export default api;