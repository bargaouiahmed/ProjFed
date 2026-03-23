export default function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
