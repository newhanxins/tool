# 初始init
npm init -y
# 安装地图依赖
npm install ol
# 安装babel
npm install @babel/core @babel/cli @babel/preset-env babel-loader @babel/preset-react @babel/preset-typescript --save-dev
# 安装rollup
npm install rollup @rollup/plugin-babel @rollup/plugin-node-resolve rollup-plugin-terser rollup-plugin-postcss @rollup-plugin-commonjs --save-dev

# 安装terser
npm install --save-dev terser
 # 安装commonjs
npm install --save-dev @rollup/plugin-commonjs

# package.json文件
```javaScript
{
  "name": "olmaps",
  "version": "1.0.0",
  "description": "",
  "main": "dist/olmaps.js",
  "module": "dist/olmaps.esm.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "babel": "babel src -d lib",
    "minify": "terser lib/index.js -o lib/index.min.js",
    "build": "rollup -c",
    "prepublishOnly": "npm run build"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.25.6",
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.4",
    "@babel/preset-react": "^7.24.7",
    "@babel/preset-typescript": "^7.24.7",
    "@rollup/plugin-babel": "^6.0.4",
    "@rollup/plugin-commonjs": "^26.0.1",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "rollup": "^2.79.1",
    "rollup-plugin-postcss": "^4.0.2",
    "rollup-plugin-terser": "^7.0.2",
    "terser": "^5.31.6"
  },
  "dependencies": {
    "build": "^0.1.4",
    "ol": "^5.3.3"
  },
  "peerDependencies": {
    "ol": "^5.3.3"
  }
}

```
# .babelrc文件
在项目根目录下创建一个 .babelrc 文件，添加如下配置
```javaScript
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```
# .eslintrc.js文件
在项目根目录下创建一个 .eslintrc.js 文件，添加如下配置
```javaScript
module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
# rollup.config.js文件
```javaScript
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: 'src/index.js',
  output: [
    {
        file: 'dist/olMaps.js',
        format: 'umd',//UMD 格式的输出（适用于浏览器和 Node.js）
        name: 'olMaps',
        globals:{
            ol: 'ol'
        },
        sourcemap: true  // 生成 sourcemap 文件，方便调试
    },
    {
        file: 'dist/olMaps.esm.js',// ES Modules 格式的输出（适用于 npm 包）
        format: 'esm',
        sourcemap: true
    },
    {
        file: 'dist/ol-maps.cjs.js',  // CommonJS 格式的输出（适用于 Node.js 和 CommonJS）
        format: 'cjs',
        sourcemap: true,
        exports: 'auto', // 或 'default' 根据需要选择合适的导出方式
    }
  ],
  plugins: [
    nodeResolve(), // 处理模块导入 // 处理 node_modules 中的模块
    commonjs(), // 处理 CommonJS 模块
    terser(),// 压缩代码
    postcss({  // 处理 CSS 文件
        extract: true,  // 可选：将 CSS 提取到单独的文件
        minimize: true, // 可选：压缩 CSS
    }),
    babel({
        exclude: 'node_modules/**',  // 不转换 node_modules 中的代码
        presets: ['@babel/preset-env'], // 使用 @babel/preset-env 转译为 ES5
        babelHelpers: 'bundled' // 确保 Babel helpers 被正确处理
    }) 
  ],
  external: ['ol']// 外部依赖
};
//安装依赖
// npm init -y
// npm install ol

// {
//     "name": "my-openlayers-wrapper",
//     "version": "1.0.0",
//     "main": "lib/index.js",
//     "module": "lib/index.js",
//     "scripts": {
//       "build": "babel src -d lib"
//     },
//     "dependencies": {
//       "ol": "^latest-version"
//     },
//     "devDependencies": {
//       "@babel/core": "^latest-version",
//       "@babel/cli": "^latest-version",
//       "@babel/preset-env": "^latest-version",
//       "@babel/preset-react": "^latest-version"
//     },
//     "peerDependencies": {
//       "ol": "^latest-version"
//     }
//   }
  
//Babel 是一个工具，可以将现代 JavaScript 代码（ES6+）转译为兼容旧版本环境的代码（如 ES5）
//npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-react @babel/preset-typescript

// npm install rollup @rollup/plugin-babel rollup-plugin-node-resolve rollup-plugin-terser rollup-plugin-postcss --save-dev
// 适配commonjs
// npm install --save-dev @rollup/plugin-commonjs
//npm install --save-dev terser
```