const taskModel = require('../db/models/task')
const bcrypt = require('bcryptjs');
const taskAdd = async ctx => {
    let { appCode,password, userCode,abilitys } = ctx.request.body
    const res = await taskModel.findOne({ appCode })
    if (res) {
        ctx.status = 200;
        ctx.body = { code: 200,msg: '已经存在', data: res };
        // const updatedTask = await taskModel.findOneAndUpdate(
        //     { userCode:userCode},// 查找条件
        //     { $set: { abilitys} },// 更新内容
        //     { new: true }  // 返回更新后的文档
        //   ).then((updatedTask) => {
        //     if (!updatedTask) {
        //       ctx.status = 407;
        //       ctx.body = { code: 407,msg: 'Task not found' };
        //     } else {
        //       ctx.status = 200;
        //       ctx.body = { code: 200,msg: '成功更新', task: updatedTask };
        //     }
        //   }).catch((err) => {
        //     ctx.status = 500;
        //     ctx.body = { code: 500, msg: '更新失败', error: err };
        //   })
        // console.log("updata tasklist",updatedTask);
    } else {
        let taskData ={ appCode,password, userCode,abilitys }
        await taskModel.create(taskData).then(result => {
                console.log("new task",result);
                ctx.body = { code: 200, data: { username } }
            }).catch(err => {
                console.log("new taskerr",err);
                ctx.body = { code: 400, msg: '新增用户异常' }
            })
    }
}

const taskDel = async ctx => {
    let { userCode } = ctx.request.body
    await taskModel
        .findOneAndDelete({ userCode: userCode })
        .then(result => {
            ctx.body = { code: 200, data: result }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '删除任务异常:' + err }
        })
}

const taskFindAll = async ctx => {
    // let {username} = ctx.request.body
    await taskModel
        .find(null)
        .then(result => {
            ctx.body = { code: 200, data: result,msg:'查询成功' }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: '查询用户异常:' + err }
        })
}
const taskFindOne = async ctx => {
    let { appCode,startTimestamp, endTimestamp } = ctx.request.body
    
    await taskModel
        .findOne({ appCode: appCode })
        .then(result => {
            console.log(result)
            let taskcode=result.abilitys[0].items.code
            let datas={
                name:"任务测试",
                type:1,
                code:"0001",
                beginTime:startTimestamp,
                endTime:endTimestamp,
                contents:[taskcode],
                result:result,
            }
            ctx.body = { code: 200, data: datas }
        })
        .catch(err => {
            ctx.body = { code: 400, msg: `查询任务"${userCode}"异常:${err}` }
        })
}

module.exports = {
    taskAdd,
    taskDel,
    taskFindAll,
    taskFindOne
}