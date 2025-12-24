const mongoose = require('mongoose')

const mongoConnect = async () => {
    await mongoose
        .connect('mongodb://127.0.0.1:27017/koaServer', { useNewUrlParser: true })
        .then(() => {
            console.log('数据库连接成功')
        })
        .catch(err => {
            console.log('数据库连接失败', err)
        })
}

module.exports = mongoConnect