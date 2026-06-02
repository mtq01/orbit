import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// a node.js utility that builds reliable file paths regardless of operating system
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      // tells vite: compile 2 entry points, the React app & content script.
      input: {
        main: resolve(__dirname, "index.html"),
      },
      // tells vite: name the output files after their input names (content.ts = content.js)
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        manualChunks: undefined,
      },
    },
  },
});
