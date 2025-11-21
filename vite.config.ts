import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Polyfill process.env safely for browser environment
    'process.env': JSON.stringify(process.env || {}),
    // Polyfill global process object to avoid ReferenceError in some libs
    'process': {
      env: JSON.parse(JSON.stringify(process.env || {})),
      version: ''
    }
  },
  server: {
    host: true
  }
});