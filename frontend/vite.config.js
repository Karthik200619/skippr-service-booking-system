import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/common-api': {
        target: 'https://skippr-service-booking-system.onrender.com',
        changeOrigin: true,
      },
      '/user-api': {
        target: 'https://skippr-service-booking-system.onrender.com',
        changeOrigin: true,
      },
      '/admin-api': {
        target: 'https://skippr-service-booking-system.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
