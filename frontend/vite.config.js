import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows external access (important for EC2/Docker)
    port: 3000, // Ensure this matches your package.json scripts
    strictPort: true, // Ensures the port doesn't change if 3000 is busy
  },
  build: {
    outDir: "dist", // Output directory for the build
    sourcemap: true, // Helps with debugging in production
  },
  preview: {
    host: "0.0.0.0",
    port: 5000, // You can change this if needed
  },
});
