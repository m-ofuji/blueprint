import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

export default defineConfig({
  server: {
    open: true
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
})