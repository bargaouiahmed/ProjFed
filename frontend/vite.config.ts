import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

const apiProxyTarget = "https://api.softsolution.site";
const eduAdminHost = "edu-admin.softsolution.site";
const eduAdminOrigin = `https://${eduAdminHost}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],

  server: {
    allowedHosts: [eduAdminHost],
    cors: {
      origin: [
        eduAdminOrigin,
        /^https?:\/\/localhost(?::\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
      ],
    },
    proxy: {
      "/api/v0": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
