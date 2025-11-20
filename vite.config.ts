import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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