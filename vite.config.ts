import { execSync } from 'node:child_process';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

function gitSha(): string {
  const ciSha = process.env.GITHUB_SHA;
  if (ciSha) return ciSha.slice(0, 7);
  try {
    return execSync('git rev-parse --short=7 HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

/**
 * How many commits landed on this UTC day, which is also how many deploys ran
 * (deploy.yml fires per push to master). Used to disambiguate same-day builds.
 * Requires full history — deploy.yml checks out with fetch-depth: 0.
 */
function commitsToday(date: Date): number {
  const midnight = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  ).toISOString();
  try {
    const count = execSync(
      `git rev-list --count HEAD --since="${midnight}"`,
    ).toString();
    return Math.max(Number.parseInt(count.trim(), 10) || 1, 1);
  } catch {
    return 1;
  }
}

/** Date-based version, e.g. "v2026.07.30" or "v2026.07.30.2" for a redeploy. */
function buildVersion(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const base = `v${date.getUTCFullYear()}.${month}.${day}`;
  const sequence = commitsToday(date);
  return sequence > 1 ? `${base}.${sequence}` : base;
}

const buildDate = new Date();
const buildTime = buildDate.toISOString();

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion(buildDate)),
    __BUILD_SHA__: JSON.stringify(gitSha()),
    __BUILD_TIME__: JSON.stringify(buildTime),
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
          if (
            ['react', 'react-dom', 'react-router'].some((pkg) =>
              id.includes(`/node_modules/${pkg}/`),
            )
          ) {
            return 'react';
          }
          if (
            ['aws-amplify', '@aws-amplify/ui-react'].some((pkg) =>
              id.includes(`/node_modules/${pkg}/`),
            )
          ) {
            return 'aws';
          }
          if (
            ['chart.js', 'react-chartjs-2'].some((pkg) =>
              id.includes(`/node_modules/${pkg}/`),
            )
          ) {
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
      'react-router',
      'aws-amplify',
      '@aws-amplify/ui-react',
    ],
  },
});
