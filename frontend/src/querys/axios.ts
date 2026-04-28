import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "https://api.softsolution.site/api/v0" : "/api/v0");

export function getApiUrl(path?: string | null) {
  if (!path) return "";
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(refreshToken);
        const refreshResponse = await authApi.post<{ accessToken: string }>(
          "/auth/refresh-token",
          {
            refreshToken,
          },
        );

        const { accessToken } = refreshResponse.data;

        localStorage.setItem("accessToken", accessToken);

        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(error.config);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    return Promise.reject(error);
  },
);
