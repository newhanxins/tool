import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // 确保与后端服务地址一致
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy, options) => {
          console.log('Proxy configuration:', options)
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[PROXY REQ] ${req.method} ${req.url} -> ${options.target}${proxyReq.path}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[PROXY RES] ${req.method} ${req.url} -> Status ${proxyRes.statusCode}`)
          })
        }
      }
    }
  }
})