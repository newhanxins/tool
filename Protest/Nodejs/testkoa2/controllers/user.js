const userModel = require('../db/models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userAdd = async ctx => {
    let { username, password,logincout } = ctx.request.body
    const res = await userModel.findOne({ username })
    if (res) {
        ctx.body = { code: 407, msg: '此用户已存在' }
    } else {
        let userCode = Math.floor(Math.random() * 1000000)
        await userModel
            .create({ username, password,userCode,logincout })
            .then(result => {
                ctx.body = { code: 200, data: { username } }
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
// 用户注册
const userRegister = async ctx => {
    let { username, password } = ctx.request.body
    if (!username || !password) {
        ctx.status = 400;
        ctx.body = {code:400, message: '用户名和密码不能为空' };
        return;
    }
    console.log(username,password)
    const res = await userModel.findOne({ username })
    if (res) {
        ctx.body = { code: 407, msg: '此用户已存在' }
    }else{
         // 对密码进行加密
        let userCode = Math.floor(Math.random() * 1000000)
        const hashedPassword = bcrypt.hashSync(password, 10);
        password = hashedPassword
        await userModel
        .create({ username, password,userCode })
        .then(result => {
            ctx.body = { code: 200, data: { username,userCode } }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '新增用户异常' }
        })
    }
    
}
// 用户登录
const userLogin = async ctx => {
    let { username, password } = ctx.request.body
     // 判断是否提供了用户名和密码
    if (!username || !password) {
        //ctx.status = 400;
        ctx.body = {code:400, message: '用户名和密码不能为空' };
        return;
    }
    const user  = await userModel.findOne({ username })
    if (!user) {
        ctx.body = { code: 407, msg: '用户名或密码错误' }
    }else{
        // 检查密码是否正确
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            //ctx.status = 401;
            ctx.body = { code: 401,message: '用户名或密码错误' };
            return;
            //return ctx.status(401).json({ message: 'Invalid username or password' });
        }
        // 密码验证通过，生成 JWT token
        const payload = { userId: user._id, username: user.username };
        const secretKey = 'koa2-demo'; // 在实际应用中，应该使用更安全的方式存储密钥
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // 1小时过期
        // 返回成功信息和 token
        ctx.body = {
            code: 200,
            message: '登录成功',
            data:{
                username: user.username,
                userCode: user.userCode
            },
            token,
            
        };
    }
}
const userFindAll = async ctx => {
    // let {username} = ctx.request.body
    await userModel
        .find(null)
        .then(result => {
            ctx.body = { code: 200, data: result,msg:'查询成功' }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '查询用户异常:' + err }
        })
}
const userFindOne = async ctx => {
    let { id } = ctx.params
    await userModel
        .findOne({ _id: id })
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
    userRegister,
    userLogin,
    userDel,
    userFindAll,
    userFindOne,
    userUpdate
}