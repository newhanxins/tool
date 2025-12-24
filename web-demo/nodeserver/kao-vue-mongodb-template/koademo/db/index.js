/*
 * @Author: You
 * @Date: 2023-02-09 16:37:14
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 10:33:55
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\db\index.js
 */
const mongoose = require('mongoose')

const mongoConnect = async () => {
    await mongoose
        .connect('mongodb://127.0.0.1:27017/koaServer', { useNewUrlParser: true })
        .then(() => {
            console.log('数据库连接成功')
        })
        .catch(err => {
            console.log('数据库连接失败', err)
        // }).connection.on('disconnection',function(){
        //     console.log('断开连接');
        })
}

module.exports = mongoConnect