import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/graphql': 'http://localhost:4000',
      '/refresh_token': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
})
