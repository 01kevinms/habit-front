import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Troque "portf" pelo nome do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: '/habit-front/', 
  build: {
    outDir: 'docs'
  }
})
