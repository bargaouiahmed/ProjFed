export default function useLogout() {
  return () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
}
