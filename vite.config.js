import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://utility-bill-system-backend.vercel.app/api',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://utility-bill-system-backend.vercel.app/uploads',
        changeOrigin: true,
      },
    },
  },
});
