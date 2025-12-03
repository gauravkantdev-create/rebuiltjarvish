import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Use a stable port for server + HMR to avoid cross-port HMR failures
    port: 5175,
    host: true,
    strictPort: false,
    open: false,
    // Let Vite determine HMR client port from the served origin (avoid hardcoding)
    hmr: {
      protocol: 'ws'
    }
  },
  optimizeDeps: {
    force: true
  },
  clearScreen: false
})
