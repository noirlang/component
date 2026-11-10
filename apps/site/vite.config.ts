import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// The site runs straight off the library source, so edits show up without a library build.
const src = (p: string) => fileURLToPath(new URL(`../../packages/components/src/${p}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@noirlang\/components\/styles\.css$/, replacement: src('styles/index.css') },
      { find: /^@noirlang\/components$/, replacement: src('index.ts') },
    ],
    dedupe: ['react', 'react-dom', 'motion'],
  },
  server: { port: 5180 },
})
