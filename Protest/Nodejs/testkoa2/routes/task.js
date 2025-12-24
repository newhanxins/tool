const router = require('koa-router')()
const {taskAdd,taskDel,taskFindAll, taskFindOne} = require('../controllers/task')
router.prefix('/bus/task')// 定义路由前缀
router.post('/operations', taskAdd)
//登录接口
router.post('/receiveTaskInfo', taskFindOne);
module.exports = router
