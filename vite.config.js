import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7138', //aca deberia ir el puerto del backend
        secure: false
      }
    }
  },

  plugins: [
    react(),
    tailwindcss()
  ],
});
