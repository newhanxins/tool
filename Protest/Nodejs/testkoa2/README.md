## koa2 -e testkoa2

   create : testkoa2
   create : testkoa2/package.json
   create : testkoa2/app.js
   create : testkoa2/public
   create : testkoa2/routes
   create : testkoa2/routes/index.js
   create : testkoa2/routes/users.js
   create : testkoa2/views
   create : testkoa2/views/index.ejs
   create : testkoa2/views/error.ejs
   create : testkoa2/bin
   create : testkoa2/bin/www
   create : testkoa2/public/images
   create : testkoa2/public/stylesheets
   create : testkoa2/public/stylesheets/style.css

   install dependencies:
     > cd testkoa2 && npm install

   run the app:
     > SET DEBUG=koa* & npm start testkoa2

   create : testkoa2/public/javascripts

   # 项目安装脚手架
   npm install -g koa-generator
   #创建项目
   koa2 -e testkoa2
   #安装依赖
   npm install
   #启动项目
   npm start testkoa2

   #项目启动
   npm start testkoa2
   #项目调试
   npm run dev testkoa2

   #项目启动
   SET DEBUG=koa* & npm start testkoa2
   #项目调试
   SET DEBUG=koa* & npm run dev testkoa2

   #项目启动
   SET DEBUG=koa* & npm start testkoa2
   #项目调试
   https://blog.csdn.net/z2823930772/article/details/123842405

   # 依赖安装
   ## npm install cors --save
   解决跨域问题
   ```javascript
    const cors = require('cors');
    // 使用 CORS 中间件，允许所有域进行跨域请求
    app.use(cors());
    //如果你想仅允许特定的域进行访问（例如前端只在 http://localhost:8080 上运行），可以进行更细粒度的控制：
    //app.use(cors({
    //   origin: 'http://localhost:8080' // 只允许此域名访问
    // }));
   ```
   ## npm install koa --save
   ## npm install koa-router --save
   ## npm install koa-bodyparser --save
   ## npm install koa-views --save
   ## npm install ejs --save
   ## npm install koa-static --save
   ## npm install koa-session --save
   ## npm install koa-logger --save
   ## npm install koa-onerror --save
   ## npm install koa-json --save
   ## npm install koa-body --save
   ## npm install koa-parameter --save

   ## npm install jsonwebtoken bcryptjs mongoose --save
   //mongoose：用于连接和操作 MongoDB。
   //jsonwebtoken 用于生成和验证 JWT 
   //bcryptjs用于加密密码，确保密码安全
   ## npm install ws uuid
   //ws：用于创建 WebSocket 服务器
   //uuid：用于生成唯一标识符，用于生成 WebSocket 连接的 ID
  ## npm install nodemon --save-dev
   // nodemon 配置链接https://blog.csdn.net/qq_44741577/article/details/136455374