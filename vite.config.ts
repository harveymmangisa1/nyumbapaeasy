import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    sourcemapIgnoreList: (sourcePath) => {
      // Ignore sourcemap ENOENT errors for lucide-react individual icon files
      return sourcePath.includes('lucide-react/dist/esm/icons');
    },
  },
})