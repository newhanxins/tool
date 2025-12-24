/*
 * @Author: You
 * @Date: 2023-02-09 16:52:20
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 15:47:54
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\db\controllers\user.js
 */
const userModel = require('../models/user')
const userAdd = async ctx => {
    console.log("请求add")
    let { username, password } = ctx.request.body
    const res = await userModel.findOne({ username })
    if (res) {
        ctx.body = { code: 407, msg: '此用户已存在' }
    } else {
        await userModel
            .create({ username, password })
            .then(result => {
                console.log(result)
                ctx.body = { code: 200,msg:"请求成功", data: { username } }
            })
            .catch(err => {
                ctx.body = { code: 400, msg: '新增用户异常' }
            })
    }
}
const userDel = async ctx => {
    let { id } = ctx.request.body
    await userModel
        .findOneAndDelete({ _id: id })
        .then(result => {
            ctx.body = { code: 200, data: result }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '删除用户异常:' + err }
        })
}
const userFindAll = async ctx => {
    // let {username} = ctx.request.body
    await userModel
        .find(null)
        .then(result => {
            ctx.body = { code: 200, data: result }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '查询用户异常:' + err }
        })
}
const userFindOne = async ctx => {
    // let { id } = ctx.params
    let {username} = ctx.request.body
    console.log("userfindone")
    await userModel
        .findOne({username })
        .then(result => {
            console.log(result)
            ctx.body = { code: 200, data: result }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: `查询用户"${username}"异常:${err}` }
        })
}
const userUpdate = async ctx => {
    let { username, id } = ctx.request.body
    await userModel
        .updateOne({ _id: id }, { username })
        .then(result => {
            ctx.body = { code: 200, data: result }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: `修改用户"${username}"异常:${err}` }
        })
}
module.exports = {
    userAdd,
    userDel,
    userFindAll,
    userFindOne,
    userUpdate
}