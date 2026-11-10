import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/entry.ts', formats: ['es'], fileName: 'index', cssFileName: 'styles' },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^motion($|\/)/],
      // Components use hooks; mark the bundle as client code for React Server Components hosts.
      output: { banner: "'use client';" },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
