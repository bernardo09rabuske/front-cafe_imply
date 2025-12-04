export function forceLogout() {
  localStorage.removeItem("token");

  window.location.href = "/login"; 
}