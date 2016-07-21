var mongoose = require('mongoose'),
    groupSchema = require('./schemas/groupSchema'),
    userSchema = require('./schemas/userSchema'),
    taskSchema = require('./schemas/taskSchema')
    Schema = mongoose.Schema;

// mongoose.connect('mongodb://needsclosure:needsclosure1@ds021289.mlab.com:21289/needsclosure');
mongoose.connect('mongodb://timtimClark:nancat5@ds027215.mlab.com:27215/nantasks');


module.exports = {user: User, task: Task, group: Group};
