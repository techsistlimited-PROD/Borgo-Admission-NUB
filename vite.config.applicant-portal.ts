import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: "./client/apps/applicant-portal",
  build: {
    outDir: "../../../dist/applicant-portal",
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  server: {
    host: "::",
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [".", "../../shared", "../../.."],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "../../../server/**"],
    },
  },
});
