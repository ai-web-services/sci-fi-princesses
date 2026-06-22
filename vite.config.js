import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'public/index.html',
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 8090,
    strictPort: true,
    allowedHosts: ['omega2-1.tail62bd55.ts.net'],
  },
});
