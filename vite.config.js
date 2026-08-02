import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-page static site. No proxy, no SSR, no env plumbing needed.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false, // one small stylesheet beats several round-trips here
    rollupOptions: {
      output: {
        // Bucket by path, not by package name: `react-dom/client` is a separate
        // entry from `react-dom`, so a name list silently leaks React into the
        // app chunk. Content edits must never invalidate the library chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'motion'
          }
          return 'react'
        },
      },
    },
  },
})
