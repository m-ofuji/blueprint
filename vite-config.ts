import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    open: true
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
    includeAssets: ['icon_72.png', 'icon_96.png', 'icon_144.png', 'icon_168.png', 'icon_180.png', 'icon_192.png'],
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'Toporis',
      short_name: 'Toporis',
      description: 'Toporis',
      background_color: "#fff",
      theme_color: '#fff',
      start_url: "/",
      display: "standalone",
      icons: [
        {
          src: "./icon_48.png",
          sizes: "48x48",
          type: "image/png"
        }, {
          src: "./icon_72.png",
          sizes: "72x72",
          type: "image/png"
        }, {
          src: "./icon_96.png",
          sizes: "96x96",
          type: "image/png"
        }, {
          src: "./icon_144.png",
          sizes: "144x144",
          type: "image/png"
        }, {
          src: "./icon_168.png",
          sizes: "168x168",
          type: "image/png"
        }, {
          src: "./icon_192.png",
          sizes: "192x192",
          type: "image/png"
        }
      ]
    }
  })],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
})