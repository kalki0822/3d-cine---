import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/3d-cine---/',
  plugins: [react()],
  server: {
    port: 5175,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'gsap-vendor': ['gsap', 'gsap/ScrollTrigger'],
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
});
