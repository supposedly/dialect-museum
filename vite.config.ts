import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // tsConfigPaths(),
  ],
  resolve: {
    alias: {
      // '/src': fileURLToPath(new URL('./src', import.meta.url))
      src: '/src'
    }
  }
})
