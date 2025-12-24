
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// 用于复制 public 资源到 dist
const copyPublicPlugin = () => {
  return {
    name: 'copy-public',
    closeBundle() {
      const fs = require('fs');
      const path = require('path');
      const publicDir = path.resolve(__dirname, 'public');
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(publicDir)) return;
      fs.readdirSync(publicDir).forEach(file => {
        const src = path.join(publicDir, file);
        const dest = path.join(distDir, file);
        if (fs.lstatSync(src).isFile()) {
          fs.copyFileSync(src, dest);
        }
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    }
  }
});
