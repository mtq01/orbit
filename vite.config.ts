import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// a node.js utility that builds reliable file paths regardless of operating system
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // tells vite: compile 2 entry points, the React app & content script.
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content.ts")
      },
      // tells vite: name the output files after their input names (content.ts = content.js)
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
})