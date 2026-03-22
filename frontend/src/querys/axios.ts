import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v0",
});

const authApi = axios.create({
  baseURL: "/api/v0",
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
      }
    }
    return Promise.reject(error);
  },
);
