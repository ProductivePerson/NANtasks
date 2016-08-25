var db = require('./database.js');
var jwt  = require('jwt-simple');


var taskFuncs = {

	/* TASK FUNCTIONS */

	updateAvatar: function(data, res) {
		console.log("\nHERE HERE HERE", data);

		db.user.update({"username":data.username},{"avatar": data.avatar}, function (err) {
			if (err) {
				console.error(err);
				res.send("Unable to update username");
			} else {
				res.send("Updated username! I think!");
			}
		});

		// db.user.update({'title':'MongoDB Overview'},{$set:{'title':'New MongoDB Tutorial'}});

	},

	updateUsername: function(req, res) {
		//checks to see if new username already exists
		db.user.findOne({"username": req.body.newUsername}, function(err, found){
			if(!found) {
				console.log(req.body.newUsername, "username not found, so that's good for you!");
				//updates old username with new username
				db.user.update({"username": req.body.oldUsername}, {"username": req.body.newUsername}, function(err, success) {
					if (err) {
			 		  res.send("can't update username!");
				 	} else {
						console.log("new username is", req.body.newUsername);
				 		res.send(req.body.newUsername);
				 	}
					// console.log("new username is", req.body.newUsername);
					// res.send(req.body);
				});
			} else {
				console.log("someone has this name: ", req.body.newUsername);
				res.send("someone has this name!");
			}
		});
	},

	// checks to see if user exists if so return the userId for that user.
	checkUser: function(userName, res) {
		db.user.findOne({"username": userName}, function(err, found){
			if(err) {
				console.log("username not found");
			}else {
				res.send(found._id);
			}
		});
	},

	getAllUsers: function(res) {
  	db.user.find({},  function(err, users) {
      if(err){
				console.log("ya dun fucked up son", err);
			}
			res.send(users);
  	});
  },

	getUserTasks: function(user, res){
		db.task.find({"owner": user}, function(err, tasks){
			if(err){
				console.log("tasks not fetched", err);
			}
			// console.log("tasks", tasks);
			res.send(tasks); //sends back array of tasks
		});
	},

  //same as above, but this returns all tasks created by user.
	getCreatedTasks: function(user, res){
		db.task.find({"creator": user}, function(err, tasks){
			if(err){
				console.log("tasks not fetched", err);
			}
			console.log("tasks", tasks);
			res.send(tasks); //sends back array of tasks
		});
	},

	addTask: function(task, res) {
		var newTask = new db.task(task);
		newTask.save(function(err){
			if(err) {
				console.log("error:", err);
			}
			console.log("Task Added!", newTask);
			res.send(newTask); //sends back added task
		});
	},

	deleteTask: function(id, res){
		db.task.remove({"_id": id}, function (err) {
			if(err){
				console.log("Error: ", err);
			}
			res.send("task removed");
		});

	},
	completeTask: function(id, res){
		db.task.update({"_id": id}, {
			completed: true

		}, function(err){
			if(err) {
				console.log("task not marked as complete", err);
			}
			res.send("task marked as complete");
		});
	},

  //toggles the poked key of the db object.
	pokeTask: function(id, res){
		var toggle;
		db.task.find({"_id": id}, function(err, docs) {
      toggle = !docs[0]["poked"];
			db.task.update({"_id": id}, {
				poked: toggle
			}, function(err){
				if(err) {
					console.log("task not marked as poked", err);
				}
				res.send("task marked as poked");
			});
		});
	},

	editTask: function(id, editedTask, res){
		// updates the task name based on the request body and the id associated with it.

		db.task.update({"_id": id}, {
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
		var group = new db.group({"name": groupName});

		db.user.update({"username": username}, {$push:{"groups": group}},
		function(err){
			if(err){
				res.send(new Error("new group not saved to user document"));
			}

			db.user.findOne({"username": username}, function(err, user){
				group.users.push(user);
				group.save(function(err){
					if(err) {
						res.send("group not created", err);
					}
					res.send(group);
				});
			});
		});

	},

	// adds User to Group AND adds group to user
	addUserToGroup: function(username, groupId, res){
		db.user.findOne({"username": username}, function(err, user){
			if(err){
				res.send("User not found", err);
			}

			if(!user.length) {
				db.group.findOne({"_id": groupId}, function(error, group) {
					if(error){
						console.log("The group was not found", error);
					}
					console.log("group");
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
							});
						});
					}
				});
			}
			else{
				res.send(new Error("user not found"));
			}

		});

	},

	//get users for current group
	getUsers: function(groupID, res){
		db.group.findOne({"_id": groupID}).populate('users').exec(function(err, group){
			if(err){
				console.log("group not found", err);
			}
			// console.log("Members of group:", group.users);
			res.send(group.users); //will return an array of user objects in the group
		});
	},

	//get tasks for group
	collectGroupTasks: function(groupId, res){
		db.task.find({"group": groupId}, function(error, tasks) {
			if(error){
				console.log("Group tasks weren't retrieved", error);
			}
			// console.log("successfully retrieved group tasks:", tasks);
			res.send(tasks);
		});
	},

	//get groups that user is a member of
	getGroups: function(username, res) {
		db.user.findOne({"username": username}).populate('groups').exec(function(error, user) {
			if(error) {
				console.log("Error in finding groups", error);
			}else {
				if(!user.groups.length) {
					res.send("user does not have any groups");
				}else {
					// console.log("groups: ", user.groups);
					res.send(user.groups);
				}
			}
		});
	},

	deleteUserFromGroup: function(userID, groupID, res){
		db.group.findOne({"_id": groupID}, function(error, group){
			group.users.remove({"_id": userID}), function(err) {
				if (err) {
					console.log("there was an error removing the user from group");
				}
				console.log("user removed from group");
			}
		});
	},



	/* AUTHENTICATION FUNCTIONS */

	signup: function(newUser, res, next) {
		db.user.find({"username": newUser.username}, function(err, user){
			if(err) {
				console.log("Error: ", error);
			}
			if(!user.length) { //if a user is not found, an empty array is returned
				console.log("user does NOT already exist");

				var user = new db.user(newUser);
				user.avatar = [0, 0];
				user.save(function(err){
					if(err) {
						console.log("new user not saved", err);
					}
					console.log("new user saved");
					var token = jwt.encode(user, 'secret'); //create new token
					res.json({"token": token, "user": {"id": user._id, "username": user.username}}); //send new token and user object
				});

			}
			else {
				console.log("user already exists: ", user);
				next(new Error("user already exists"));
			}
		});
	},

	signin: function(reqUser, res, next){
		db.user.find({"username": reqUser.username}, function(err, user){
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
						next(new Error("Incorrect password")); //will send an error if incorrect password
					}
					else{
						console.log("password correct!");

						/**
							this will find out if the user is already signed in, if he/she is
							then nothing will happen if he/she is not then a new document with that
							user's username will be created
						*/
						db.inUser.find({username: user[0]['username']},function(err,inUser){
							if(err){
								console.log("Signed in user err ",err);
							}

							//user is NOT signed in, if the inUser array is empty
							if(!inUser.length){
								console.log("User NOT signed in ")
								var newSignedInUser = new db.inUser({username: user[0]['username']})
								newSignedInUser.save(function(err){
									if(err){
										console.log("Signed in Users error ",err);
									}
								});
							}
						});

						var token = jwt.encode(user[0], 'secret'); //create new token
						res.json({"token": token, "user": {"id": user[0]._id, "username": user[0].username}}); //send new token and user object
					}
				});
			}
		});
	},

	signedin: function(reqUser, res, next){
		db.inUser.find({}, function(err, signedInUsers){
			if(err) {
				console.log("signed in users error ",err);
			}else {
				res.send(signedInUsers);
			}
		});
	},

	signout: function(reqUser, res, next){
		db.inUser.findOne({"username": reqUser.username}, function(err, found) {
			if(err) {
				console.log("username not found");
			} else if (found !== null) {
				console.log("found the user you want to delete ", found);
				found.remove();
				res.status(200).send();
			}
		});
	},

	checkAuth: function(req, res, next){
		var token = req.headers['x-access-token'];
		if (!token) {
			next(new Error('No token'));
		}
		else {
			var user = jwt.decode(token, 'secret');
			console.log("Decoded user:", user);
			db.user.find(user, function(err, user){
				if(err){
					next("Error: ", error);
				}
				if(!user.length){ //user not found
					res.status(401).send();
				}
				else{ //token decoded and user found in database
					console.log("user authenticated");
					res.status(200).send();
				}
			});
		}
	}
};


module.exports = taskFuncs;
