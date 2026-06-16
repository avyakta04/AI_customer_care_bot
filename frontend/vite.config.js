import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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

    // Proxy for Node.js API Gateway at localhost:3000
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/ws': {
        target: 'ws://localhost:3000',
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
})
