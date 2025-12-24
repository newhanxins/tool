/*
 * @Author: You
 * @Date: 2023-02-09 15:38:20
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 15:44:39
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\routes\users.js
 */
const router = require('koa-router')()
const { userAdd, userFindOne,userFindAll} = require('../db/controllers/user')
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
router.post('/add', userAdd)
router.post('/login', userFindOne)
module.exports = router
