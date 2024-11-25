import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    watch: {
      usePolling: true, // Enables polling for file changes on Linux
      interval: 1000, // Optional: Adjust the polling interval as needed
    },
  },
})
