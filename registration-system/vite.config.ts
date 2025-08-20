import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/registration/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  build: {
    outDir: "../public/registration",
    sourcemap: true,
    emptyOutDir: true,
  },
});
