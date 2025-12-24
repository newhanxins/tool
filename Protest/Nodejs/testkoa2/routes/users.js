const router = require('koa-router')()
const { userAdd,userFindAll,userRegister,userLogin } = require('../controllers/user')
router.prefix('/users')// 定义路由前缀

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
router.post('/add', userAdd)
//登录接口
router.post('/login', userLogin)
// 注册接口（用于演示用户注册过程）
// router.post('/register', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })
router.post('/register', userRegister);
module.exports = router
