var mongoose = require('mongoose'),
    groupSchema = require('./schemas/groupSchema'),
    userSchema = require('./schemas/userSchema'),
    taskSchema = require('./schemas/taskSchema'),
    Schema = mongoose.Schema;


// mongoose.connect('mongodb://needsclosure:needsclosure1@ds021289.mlab.com:21289/needsclosure');
mongoose.connect('mongodb://timtimClark:nancat5@ds027215.mlab.com:27215/nantasks');

var User = mongoose.model('User', userSchema),
    Task = mongoose.model('Task', groupSchema),
    Group = mongoose.model('Group', groupSchema);

module.exports = {user: User, task: Task, group: Group};
