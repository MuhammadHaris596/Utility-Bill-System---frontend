import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['sweetalert2'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://utility-bill-system-backend.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
