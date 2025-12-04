import axios from "axios";

const API_URL = "http://localhost:8000/api"; // ajuste para seu backend

// Configura Axios com token se existir
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const register = async (fullName: string, email: string, password: string) => {
  return api.post("/auth/register", { name: fullName, email, password });
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const getUser = async () => {
  return api.get("/user"); // rota teste ou rota real do backend
};
