import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    // Expose process.env for compatibility with Jest tests
    'process.env.VITE_STRIPE_PK': JSON.stringify(process.env.VITE_STRIPE_PK),
    'process.env.VITE_PRICE_MO': JSON.stringify(process.env.VITE_PRICE_MO),
    'process.env.VITE_PRICE_YR': JSON.stringify(process.env.VITE_PRICE_YR),
    'process.env.VITE_NEW_UI': JSON.stringify(process.env.VITE_NEW_UI),
    'process.env.VITE_ACCESS_CODE': JSON.stringify(
      process.env.VITE_ACCESS_CODE,
    ),
  },
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
        manualChunks(id) {
          if (['react', 'react-dom', 'react-router-dom'].some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'react';
          }
          if (['aws-amplify', '@aws-amplify/ui-react'].some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'aws';
          }
          if (['chart.js', 'react-chartjs-2'].some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'charts';
          }
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
