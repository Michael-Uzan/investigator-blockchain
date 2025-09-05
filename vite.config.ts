import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://blockstream.info",
        changeOrigin: true,
        rewrite: (path: string) =>
          path.startsWith("/api") ? path.slice(4) : path,
      },
    },
  },
});
