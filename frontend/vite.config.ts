import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Encaminha as chamadas da API para o backend Spring Boot em desenvolvimento
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      // Encaminha o acesso às imagens salvas localmente pelo backend
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})