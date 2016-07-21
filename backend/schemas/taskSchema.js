var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//TASK SCHEMA
var taskSchema = new Schema({
  name: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  createdAt: Date,
  dueDate: Date,
  completed: Boolean,
  group: {type: Schema.Types.ObjectId, ref: 'Group'}
});

taskSchema.pre('save', function(next){
  if(!this.group){this.group =  this.owner;}
  next();
});

module.exports = taskSchema;
