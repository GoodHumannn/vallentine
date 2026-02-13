import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' allows the app to be served from a subdirectory (like GitHub Pages) 
  base: './', 
  server: {
    open: true, // Opens browser automatically when running 'npm run dev'
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {
    'process.env': {} 
  }
});