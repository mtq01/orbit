import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// a node.js utility that builds reliable file paths regardless of operating system
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // lets imports use "@/..." as a shortcut for "src/..."
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      // tells vite: compile the React side panel. content.ts is bundled separately by esbuild (see "build" in package.json).
      input: {
        main: resolve(__dirname, "index.html"),
      },
      // tells vite: name the output files after their input names (main = main.js)
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        manualChunks: undefined,
      },
    },
  },
});
