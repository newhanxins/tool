const userModel = require('../models/user')
const userAdd = async ctx => {
    let { username, password,logincout } = ctx.request.body
    const res = await userModel.findOne({ username })
    if (res) {
        ctx.body = { code: 407, msg: '此用户已存在' }
    } else {
        await userModel
            .create({ username, password,logincout})
            .then(result => {
                ctx.body = { code: 200, data: { username } }
            })
            .catch(err => {
                ctx.body = { code: 400, msg: '新增用户异常' }
            })
    }
}
module.exports = {
    userAdd
}