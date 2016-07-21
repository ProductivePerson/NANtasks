var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//GROUP SCHEMA
var groupSchema = new Schema({
  name: String,
  users:[{type: Schema.Types.ObjectId, ref: 'User'}],
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
});
// contains an array of user ids along with an array of task ids

module.exports = groupSchema;
