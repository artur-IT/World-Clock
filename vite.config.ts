import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repo from /World-Clock/, not the domain root
  base: command === 'build' ? '/World-Clock/' : '/',
  plugins: [react()],
}))
