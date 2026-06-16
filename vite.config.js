import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@services': resolve(__dirname, './src/services'),
      '@charts': resolve(__dirname, './src/charts'),
      '@animations': resolve(__dirname, './src/animations'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },

  // Development server config
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: true,

    // Proxy for FastAPI backend at localhost:8000
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
    },
  },

  // Preview server config (production preview)
  preview: {
    host: '0.0.0.0',
    port: 4173,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'motion-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },

  // Environment variables prefix
  envPrefix: 'VITE_',
=======

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> 987d03ae86da3d6ad18815118b36c0ed046b6776
})
