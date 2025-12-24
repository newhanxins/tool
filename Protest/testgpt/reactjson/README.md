# Windows 下 openssl 安装与密钥生成方法

## 方法一：使用 Chocolatey 安装 openssl
1. 管理员权限打开 PowerShell，安装 Chocolatey（如未安装）：
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```
2. 安装 openssl：
   ```powershell
   choco install openssl
   ```
3. 安装完成后，重启 PowerShell，输入 `openssl version` 检查是否安装成功。
4. 生成密钥：
   ```powershell
   openssl genrsa -out key.pem 2048
   ```

## 方法二：使用 PowerShell 生成密钥（无需 openssl）
1. 管理员权限打开 PowerShell，执行：
   ```powershell
   $rsa = [System.Security.Cryptography.RSACryptoServiceProvider]::new(2048)
   $pem = $rsa.ExportRSAPrivateKey()
   [System.IO.File]::WriteAllBytes("key.pem", $pem)
   ```
2. 生成的 key.pem 可直接用于 crx 打包。
# Chrome 插件打包方式

## 1. dist 文件夹手动加载
1. 运行 `npm run build`，生成 dist 文件夹。
2. 手动将 public 目录下的 manifest.json、图标等资源复制到 dist。
3. 在 Chrome 扩展管理页面加载 dist 目录。

## 2. 打包成 crx 文件
1. 安装 crx-pack：`npm install -g crx-pack` 或已在本项目 devDependencies。
2. 生成密钥（首次打包时）：
   ```powershell
   openssl genrsa -out key.pem 2048
   ```
3. 打包命令：
   ```powershell
   npx crx pack dist --key=key.pem
   ```
4. 生成的 .crx 文件可直接分发安装。
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



