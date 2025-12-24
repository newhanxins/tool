/*
 * @Author: You
 * @Date: 2023-02-09 16:51:53
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-02-14 13:59:38
 * @FilePath: \mini-vuef:\web-dome\nodeserver\koademo\db\models\user.js
 */
const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required: true
  }
})
const userModel = mongoose.model('users',userSchema)
module.exports =userModel