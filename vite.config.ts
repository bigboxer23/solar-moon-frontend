import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/v1': {
        target: 'https://app.solarmoonanalytics.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          aws: ['aws-amplify', '@aws-amplify/ui-react'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
  resolve: {
    alias: {},
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'aws-amplify',
      '@aws-amplify/ui-react',
    ],
  },
});
