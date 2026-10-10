import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/media-proxy/falabella': {
        target: 'https://media.falabella.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/media-proxy\/falabella/, ''),
      },
    },
  },
});