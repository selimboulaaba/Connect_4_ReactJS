import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks stay cached between deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run)[\/]/.test(id)) return 'react'
          if (id.includes('@radix-ui') || id.includes('sonner')) return 'ui'
          if (id.includes('socket.io') || id.includes('engine.io')) return 'socket'
          if (id.includes('lucide-react')) return 'icons'
        },
      },
    },
  },
})
