var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = require('./schemas/groupSchema')
var userSchema = require('./schemas/userSchema')
var taskSchema = require('./schemas/taskSchema')

mongoose.connect('mongodb://needsclosure:needsclosure1@ds021289.mlab.com:21289/needsclosure');

//These variables wil
var Task = mongoose.model('Task', taskSchema);
var User = mongoose.model('User', userSchema);
var Group = mongoose.model('Group', groupSchema);


module.exports = {task: Task, user: User, group: Group};

// //TASK SCHEMA
// var taskSchema = new Schema({
//   name: String,
//   owner: {type: Schema.Types.ObjectId, ref: 'User'},
//   createdAt: Date,
//   dueDate: Date,
//   completed: Boolean,
//   group: {type: Schema.Types.ObjectId, ref: 'Group'}
// });
//
// taskSchema.pre('save', function(next){
//   if(!this.group){this.group =  this.owner}
//     next();
// })
//
//
//
// //USER SCHEMA
// var UserSchema = new Schema({
//   username: { type: String, required: true, index: { unique: true } },
//   password: { type: String, required: true },
//   token: String,
//   tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
//   groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
// });
//
// UserSchema.pre('save', function(next) {
//     var user = this;
//
// // only hash the password if it has been modified (or is new)
// if (!user.isModified('password')) return next();
//
// // generate a salt
// bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);
//
//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) return next(err);
//
//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//     });
// });
//
// });
//
// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };
