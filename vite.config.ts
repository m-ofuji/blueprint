import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'
import react from '@vitejs/plugin-react'
import * as path from "path";

export default defineConfig({
  server: {
    open: true
  },
  plugins: [
    react(),
    compression({
      threshold: 1024,
      algorithms: ['brotliCompress']
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
})