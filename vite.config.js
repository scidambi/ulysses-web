import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,tsx}",
    fastRefresh: true
  })],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "@mui/material", "chart.js", "react-chartjs-2"]
        }
      }
    }
  }
});