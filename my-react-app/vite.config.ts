import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase', // Позволяет использовать camelCase для классов
    },
  },
  plugins: [react()],
})
