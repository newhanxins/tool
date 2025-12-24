/*
 * @Author: You
 * @Date: 2023-03-01 09:09:54
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-03-01 09:34:26
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\swagger.js
 */
const router = require('koa-router')() //引入路由函数
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')
router.prefix('/swagger')  //设置路由，与app.js中的路由配置保持一致
const swaggerDefinition = {
    info: {
        title: 'blog项目访问地址',
        version: '1.0.0',
        description: 'API',
    },
    host: 'localhost:8000',// 想着改这里，如果不修改，那么接口文档访问地址为：localhost:8000/swagger
    basePath: '/' // Base path (optional)
};
const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, './routes/*.js')], // 写有注解的router的存放地址, 最好path.join()
};
const swaggerSpec = swaggerJSDoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
module.exports = router