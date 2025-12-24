const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required: true
  },
  userCode:{
    type:String,
    required: true
  },
  logincout:{
    type:String,
    required: false 
  }
})
const userModel = mongoose.model('users',userSchema)
module.exports =userModel