import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    open: true
  },
  plugins: [react(),tsconfigPaths()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
})