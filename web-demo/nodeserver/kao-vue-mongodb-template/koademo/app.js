/*
 * @Author: You
 * @Date: 2023-02-09 15:38:20
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-03-01 09:32:02
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\app.js
 */
const Koa = require('koa')
var cors = require('koa2-cors');
const app = new Koa()

const views = require('koa-views')
const json = require('koa-json')// 告诉客户端『返回的是 JSON 数据』
const onerror = require('koa-onerror')// koa有error事件，当发生错误，可以通过error事件，对错误统一处理
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')


const swagger = require('./swagger')  // 存放swagger.js的位置，可以自行配置，我放在了根目录
const { koaSwagger } = require('koa2-swagger-ui')
// https://www.cnblogs.com/ygunoil/p/15657374.html

const index = require('./routes/index')
const users = require('./routes/users')

const mongoConnect = require('./db')
mongoConnect()
// error handler
onerror(app)
//cors
app.use(cors());


//doc
// 接口文档配置
app.use(swagger.routes(), swagger.allowedMethods())
app.use(koaSwagger({
  routePrefix: '/swagger/index.html', // 接口文档访问地址
  swaggerOptions: {
    url: '/swagger/swagger.json', // example path to json 其实就是之后swagger-jsdoc生成的文档地址
  }
}))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))




// logger
app.use(async (ctx, next) => {
  const start = new Date()
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', 'content-type')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE')
  await next()
  const ms = new Date() - start
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
