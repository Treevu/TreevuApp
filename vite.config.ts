import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: '.',
      publicDir: 'public',
      build: {
        outDir: 'dist'
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@/components': path.resolve(__dirname, 'src/components'),
          '@/features': path.resolve(__dirname, 'src/features'),
          '@/contexts': path.resolve(__dirname, 'src/contexts'),
          '@/hooks': path.resolve(__dirname, 'src/hooks'),
          '@/types': path.resolve(__dirname, 'src/types'),
          '@/services': path.resolve(__dirname, 'src/services'),
          '@/utils': path.resolve(__dirname, 'src/utils'),
          '@/data': path.resolve(__dirname, 'src/data')
        }
      }
    };
});
