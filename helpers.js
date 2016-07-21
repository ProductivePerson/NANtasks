var Model = require('./database.js');
var jwt  = require('jwt-simple');


var taskFuncs = {

/* TASK FUNCTIONS */
	
	// checks to see if user exists if so return the userId for that user. 

 checkUser: function(userName, res) {
		Model.user.findOne({"username": userName}, function(err, found){
		  if(err) {
        console.log("username not found");
		  }else {
        res.send(found._id);
		  }
		})
  },

	getUserTasks: function(user, res){
		Model.task.find({"owner": user}, function(err, tasks){
			if(err){
				console.log("tasks not fetched", err);
			}
			console.log("tasks", tasks);
			res.send(tasks); //sends back array of tasks
		});
	},

	addTask: function(task, res) {
		var newTask = new Model.task(task);
		newTask.save(function(err){
			if(err) {
				console.log("error:", err);
			}
			console.log("Task Added!", newTask);
			res.send(newTask); //sends back added task
		})
	},

	deleteTask: function(id, res){
		Model.task.remove({"_id": id}, function (err) { 
			if(err){
				console.log("Error: ", err)
			}
			res.send("task removed");
		});

	},
	completeTask: function(id, res){
		Model.task.update({"_id": id}, {
			completed: true

		}, function(err){
			if(err) {
				console.log("task not marked as complete", err);
			}
			res.send("task marked as complete");
		});
	},

	editTask: function(id, editedTask, res){
		// updates the task name based on the request body and the id associated with it. 
		
		Model.task.update({"_id": id}, {
			name: editedTask
		}, function(err, obj) {
			if(err) {
				console.log("task update failed", err); 
			}
			res.send("task was updated", obj); 
		});
	},


/* GROUP FUNCTIONS */

//creates group and adds group to user
createGroup: function(groupName, username, res){
	var group = new Model.group({"name": groupName});

		Model.user.update({"username": username}, {$push:{"groups": group}}, 
			function(err){
				if(err){
					res.send(new Error("new group not saved to user document"))
				}

				Model.user.findOne({"username": username}, function(err, user){
					group.users.push(user);
					group.save(function(err){
						if(err){res.send("group not created", err)}
						res.send(group);
					})
				})
		})
	
},

	// adds User to Group AND adds group to user
	addUserToGroup: function(username, groupId, res){
		Model.user.findOne({"username": username}, function(err, user){
			if(err){
				res.send("User not found", err)
			}

			if(!user.length) {
				Model.group.findOne({"_id": groupId}, function(error, group) {
					if(error){
						console.log("The group was not found", error); 
					}
					console.log("group")
					if(group.users.indexOf(user._id) >= 0) { 
						console.log("user already exists in group");
						res.send(new Error("user already exists in group"));
					}
					else{
						group.users.push(user); 
						group.save(function(err){
							console.log("Current members of group", group.users);
							user.groups.push(group);
							user.save(function(err){
								res.send(group);
							})
						})
					}
				})
			}
			else{
				res.send(new Error("user not found"));
			}

		})

	}, 
	
	//get users for current group
	getUsers: function(groupID, res){
		Model.group.findOne({"_id": groupID}).populate('users').exec(function(err, group){
			if(err){
				console.log("group not found", err);
			}
			console.log("Members of group:", group.users);
			res.send(group.users) //will return an array of user objects in the group
		})
	},

	//get tasks for group
	collectGroupTasks: function(groupId, res){
		Model.task.find({"group": groupId}, function(error, tasks) {
			if(error){
				console.log("Group tasks weren't retrieved", error); 
			}
			console.log("successfully retrieved group tasks:", tasks);
			res.send(tasks); 
		});
	},

	//get groups that user is a member of
	getGroups: function(username, res) {
		Model.user.findOne({"username": username}).populate('groups').exec(function(error, user) {
			if(error) {
				console.log("Error in finding groups", error);
			}else {
				if(!user.groups.length) {
					res.send("user does not have any groups");
				}else {
					console.log("groups: ", user.groups);
					res.send(user.groups); 
				}
			}
		})
	}, 

	deleteUserFromGroup: function(userID, groupID, res){
		Model.group.findOne({"_id": groupID}, function(error, group){
			group.users.remove({"_id": userID}), function(err){
					if(err){
						console.log("there was an error removing the user from group");
					}
					console.log("user removed from group"); 
			}
		})
	},



/* AUTHENTICATION FUNCTIONS */

	signup: function(newUser, res, next) {
		Model.user.find({"username": newUser.username}, function(err, user){
			if(err) {
				console.log("Error: ", error);
			}
			if(!user.length) { //if a user is not found, an empty array is returned
				console.log("user does NOT already exist");
				var user = new Model.user(newUser);
				user.save(function(err){
					if(err) {
						console.log("new user not saved", err);
					}
				console.log("new user saved");
				var token = jwt.encode(user, 'secret'); //create new token
        res.json({"token": token, "user": {"id": user._id, "username": user.username}}); //send new token and user object
			})

			}
			else {
				console.log("user already exists: ", user);
				next(new Error("user already exists"));
			}
		})
	},

	signin: function(reqUser, res, next){
		Model.user.find({"username": reqUser.username}, function(err, user){
			if(err){ //if error in query
				next("Error: ", error);
			}
			if(!user.length){ //if user not found
				next(new Error("username does not exist"));
			}
			else{ //if user found
				user[0].comparePassword(reqUser.password, function(err, isMatch){
					if(err) {throw err;}
					if(!isMatch){
						next(new Error("Incorrect password")) //will send an error if incorrect password
					}
					else{
						console.log("password correct!");
						var token = jwt.encode(user[0], 'secret'); //create new token
            res.json({"token": token, "user": {"id": user[0]._id, "username": user[0].username}}); //send new token and user object
					}
				})
			}
		})
	}, 

	checkAuth: function(req, res, next){
		var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } 
    else {
      var user = jwt.decode(token, 'secret');
      console.log("Decoded user:", user);
      Model.user.find(user, function(err, user){
      	if(err){
      		next("Error: ", error);
      	}
      	if(!user.length){ //user not found
      		res.status(401).send();
      	}
      	else{ //token decoded and user found in database
      		console.log("user authenticated")
      		res.status(200).send();
      	}
      });
    }
	}
}


module.exports = taskFuncs;
