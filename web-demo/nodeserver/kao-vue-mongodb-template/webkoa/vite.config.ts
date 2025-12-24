/*
 * @Author: You
 * @Date: 2023-02-14 11:16:55
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 13:09:35
 * @FilePath: \mini-vuef:\web-dome\nodeserver\webkoa\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
        '@': path.resolve(__dirname, 'src')
    }
},
plugins: [vue()],
server: {
    port: 8080, //启动端口
    hmr: {
        host: '127.0.0.1',
        port: 8080
    },
    // 设置 https 代理
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:3000',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, '')
        }
    }
}
//https://blog.csdn.net/gongjin2012/article/details/123928788
})
