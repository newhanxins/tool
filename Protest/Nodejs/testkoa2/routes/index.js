const router = require('koa-router')()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//视图渲染
router.get('/', async (ctx, next) => {
  const ip = ctx.request.ip;
  await ctx.render('index', {
    title: 'Hello Koa 2!'+ip
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
//获取get传值
router.get('/newscontent',async(ctx)=>{
  //从ctx中读取get值
  console.log(ctx.query); //获取的是格式化的对象，例｛id:'123'｝
  console.log(ctx.querystring); //获取的是url的字符串 ,例：'id=123'
  console.log(ctx.request); //获取请求相关的信息，包括method,url，header等信息
  ctx.body = '新闻详情';
});
//动态路由 
router.get('/news/:params',async(ctx)=>{
  //aid 为自定义参数名，可以通过ctx.params访问
  //如果有多个动态传值，则可以写成 '/news/:params1/:params2'的形式
  ctx.body = ctx.params;
});
// JWT 验证中间件
const verifyToken = (ctx, next) => {
  const token = ctx.headers['authorization']?.split(' ')[1]; // 获取 Bearer token

  if (!token) {
    ctx.status = 403;
    ctx.body = { message: '没有提供认证 token' };
    return;
  }

  try {
    const secretKey = 'koa2-demo';
    const decoded = jwt.verify(token, secretKey); // 验证 token
    ctx.state.user = decoded; // 将 decoded 放入 ctx.state 中，供后续处理使用
    return next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { message: '无效的认证 token' };
  }
};
// 使用该中间件保护某些路由
router.get('/protected', verifyToken, async (ctx) => {
  ctx.body = {
    message: '你已通过身份验证',
    user: ctx.state.user,
  };
});
// 模拟的列表数据
const listData = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
];
// 获取列表数据接口，使用 JWT 验证
router.get('/list', verifyToken, async (ctx) => {
  ctx.body = {
    message: '你已通过身份验证',
    user: ctx.state.user,
    data:listData
  };
});
// router.get('/list', verifyToken, (req, res) => {
//  // res.json(listData); // 返回模拟的列表数据
//   res.body={
//     data:listData
//   }
// });
module.exports = router
