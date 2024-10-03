// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Customize your port if needed
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // The URL where your backend server is running
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api from the request
      },
    },
  },
});
