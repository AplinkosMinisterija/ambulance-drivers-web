import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { manifestForPlugIn } from './manifest';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn as Partial<VitePWAOptions>)],
    server: {
      proxy: {
        '/proxy/palantir': {
          target: env.VITE_PROXY_PALANTIR_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/palantir/, ''),
        },
        '/proxy/distance': {
          target: env.VITE_PROXY_DISTANCE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/distance/, ''),
        },
      },
    },
    assetsInclude: ['**/*.png'],
  });
};
