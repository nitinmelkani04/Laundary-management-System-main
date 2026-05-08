import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables from .env file ONLY in development
if (process.env.NODE_ENV !== "production") {
  try {
    const dotenv = require("dotenv");
    dotenv.config();
  } catch (error) {
    console.warn("dotenv not available, using system environment variables");
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        // Use environment variable with fallback to localhost for development
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
