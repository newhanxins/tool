const mongoose =require('mongoose')
const taskSchema = new mongoose.Schema({
  appCode:{
    type:String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required: true
  },
  abilitys:{
    type:[mongoose.Schema.Types.Mixed],
    default: [],
    required: false 
  },
  taskState:[{
    code:{
      type:String,
      required: false
    },
    state:{
      type:Number,
      required: false
    },
    process:{
      type:Number,
      required: false
    }
  }]
})
const taskModel = mongoose.model('task',taskSchema)
module.exports =taskModel