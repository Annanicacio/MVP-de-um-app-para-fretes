import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ 
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['mvp-de-um-app-para-fretes.onrender.com'],
  },
})
