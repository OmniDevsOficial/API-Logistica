import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': src(''),
      '@app': src('app'),
      '@pages': src('pages'),
      '@widgets': src('widgets'),
      '@features': src('features'),
      '@entities': src('entities'),
      '@shared': src('shared'),
    },
  },
})
