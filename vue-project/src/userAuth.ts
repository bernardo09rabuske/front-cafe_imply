import { ref } from "vue";
import * as authService from "./service/authService";

export const user = ref<any>(null);
export const token = ref<string | null>(localStorage.getItem("auth_token"));

export const isAuthenticated = ref(!!token.value);

export const loginUser = async (email: string, password: string) => {
  const res = await authService.login(email, password);
  token.value = res.data.token;
  localStorage.setItem("auth_token", token.value as string);
  user.value = res.data.user;
  isAuthenticated.value = true;
  return res;
};

export const registerUser = async (fullName: string, email: string, password: string) => {
  const res = await authService.register(fullName, email, password);
  token.value = res.data.token;
  localStorage.setItem("auth_token", token.value as string);
  user.value = res.data.user;
  isAuthenticated.value = true;
  return res;
};

export const logoutUser = async () => {
  await authService.logout();
  localStorage.removeItem("auth_token");
  user.value = null;
  token.value = null;
  isAuthenticated.value = false;
};
