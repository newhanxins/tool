const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
//const cors = require('cors');
const cors = require('koa2-cors'); //跨域处理
const index = require('./routes/index')
const users = require('./routes/users')
const task = require('./routes/task')
//引入数据库连接模块
const mongoConnect = require('./db')

// error handler
onerror(app)

app.use(
  cors({
      origin: function(ctx) { //设置允许来自指定域名请求

          //return '*';// 允许来自所有域名请求
          //return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
          const origin = ctx.get('Origin');  // 获取请求头中的 Origin
          console.log("now ctx",origin)
          if (origin && (origin.startsWith('http://localhost:') || origin === 'http://localhost:5173')) {
            return origin
          }else if(origin==null&& (ctx.get('host').startsWith('http://localhost:'))){
            return '*';
          }else{
            return false
          }
      },
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, // 允许携带凭证（cookies、Authorization header等）
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);                 
//原文链接：https://blog.csdn.net/lihefei_coder/article/details/95205095

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  strict: false
}))
// app.use(bodyParser({
//   enableTypes: ['json', 'form'],  // 允许解析 json 和 x-www-form-urlencoded 数据
//   jsonLimit: '2mb',               // 设置 JSON 请求体大小限制为 2MB
//   textLimit: '1mb',               // 设置文本请求体大小限制为 1MB
//   strict: false                   // 禁用严格模式，允许解析 JSON 格式的非对象类型
// }));
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger  request URL:
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes 注册路由模块
app.use(index.routes(), index.allowedMethods())//官方配置
app.use(users.routes(), users.allowedMethods())
app.use(task.routes(), task.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

mongoConnect()
module.exports = app
