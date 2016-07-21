var mongoose = require('mongoose'),
    groupSchema = require('./schemas/groupSchema'),
    userSchema = require('./schemas/userSchema'),
    taskSchema = require('./schemas/taskSchema')
    Schema = mongoose.Schema;

mongoose.connect('mongodb://needsclosure:needsclosure1@ds021289.mlab.com:21289/needsclosure');

//These variables wil
var Task = mongoose.model('Task', taskSchema);
var User = mongoose.model('User', userSchema);
var Group = mongoose.model('Group', groupSchema);


module.exports = {task: Task, user: User, group: Group};
