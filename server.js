var express = require('express');
var taskFuncs = require('./helpers.js');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + "/node_modules"));
app.use(bodyParser.json());

console.log(__dirname + "/node_modules");


app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running');
});

/* AUTHENTICATION ROUTES  */


	//add new user
app.post('/api/signup', function(req, res, next){
	/*
	proper format of request (password is in plain-text when passed from front-end):
	{
			"username": "harish",
	    "password": "abc123"
	}
	*/
	var newUser = req.body;
	taskFuncs.signup(newUser, res, next);
})

//to check if user is signed in
app.get('/api/signedin', function(req, res, next){
	//see helpers.js for format of request. It checks the req.headers['x-access-token']
	console.log("signedIn request received");
	taskFuncs.checkAuth(req, res, next);
})

//to sign in user
app.post('/api/signin', function(req, res, next){
	console.log("sign-in request received");
	// format of request object is same as signup
	var user  = req.body;
	taskFuncs.signin(user, res, next);

})


/* TASK ROUTES */


 //to receive all tasks for the current user
app.post('/api/user/usertasks', function(req, res){
	//  proper format of request
	// {
	// 	"user": "5787b4442cb0dadd096e94d7" // this is the same ID you received when the user signs in
	// }

	console.log("request received at usertasks for: ", req.body.user);
	var user = req.body.user;
	taskFuncs.getUserTasks(user, res);
})

 /*
	PROPER FORMAT OF TASK
	{
		"name": "pick up groceries",
		"owner": '578854c9bbeb92be05c47711' <-- this is the id sent when a user signs in
		"group": '57885ea24bc2a48306d93ba9' <-- this is the _id for the group that the user is posting in
		"createdAt": new Date(),
		"completed": false
}
  */


 //to add tasks
app.post('/api/tasks', function(req, res){
	console.log('request received at addTask');
	console.log("incoming task", req.body);
	var task = req.body;

	// var group = req.body.groupID;
	//  added username
	taskFuncs.addTask(task, res);
})

//to delete task
app.post('/api/tasks/delete', function(req, res){
	/* proper format of request:
		{
			"id": "5783ec2a12cda2db6ce7ac91" <-- id of task to be deleted
		}
	*/
	console.log("request received at deleteTask", req.body.id);
	taskFuncs.deleteTask(req.body.id, res);
})

//to mark task as complete
app.put('/api/tasks', function(req, res){
	//format of request same as delete request
	console.log("request received at completeTask for:", req.body.id);
	taskFuncs.completeTask(req.body.id, res);
})

//to edit name of task
app.put('/api/tasks/edit', function(req, res, next){
	// needs the request body and id

	/* proper format of request
		{
			"_id": "5783ec2a12cda2db6ce7ac91",
			"task": "go to gym"
		}
	*/
	console.log("task was updated", req.body);
	taskFuncs.editTask(req.body._id, req.body.name, res, next);
})




/* GROUP ROUTES */

//create group
app.post('/api/createGroup', function(req, res){
	console.log("request received at createGroup");
	/*
	PROPER FORMAT OF REQUEST

	{
		"username": "konstantin", <-- user that's signed in
		"groupName": "MakerSquare Students"
	}

	*/
	var username = req.body.username;
	var groupName = req.body.groupName;
	taskFuncs.createGroup(groupName, username, res);
})

//add user to group
app.put('/api/group/addUser', function(req, res, next){
	console.log("request received at addUserToGroup");
	/* PROPER FORMAT OF REQUEST
	{
		username: "konstantin", <- user to be added
		groupID: "57885ea24bc2a48306d93ba9" <- group to be altered (must be ID because there can be multiple groups with the same name in our database)
	}
	*/

	taskFuncs.addUserToGroup(req.body.username, req.body.groupID, res, next);
})


//get groups for a user
app.post('/api/user/getGroups', function(req,res) {
	/* PROPER FORMAT OF REQUEST

	{
		"username": "konstantin"
	}

	*/
	var user = req.body.username;

	taskFuncs.getGroups(user, res);
})


//get users for group
app.post('/api/group/getUsers', function(req, res){
	console.log("request received at getUsersForGroup");
	/* PROPER FORMAT OF REQUEST
	{
		groupID: "57885ea24bc2a48306d93ba9" <- group for which client wants users
	}
	*/

	taskFuncs.getUsers(req.body.groupID, res);
})


app.post('/api/group/deleteUser', function(req, res){
	
	taskFuncs.deleteUserFromGroup(req.body.id, req.body.groupID, res); 
})


// get tasks for a group
app.post('/api/group/getTasks', function(req, res) {
	/* PROPER FORMAT OF REQUEST

	{
		"groupID": "578989f8466302b50d02d97d"
	}

	*/
	var group = req.body.groupID;
	taskFuncs.collectGroupTasks(group, res); 
})


//*  USER ROUTE  *//
// Check if user exists
app.post('/api/user/check', function(req, res, next) {
 /*PROPER FORMAT OF REQUEST
	 {
			"user": "makersquare"
	 }
 */
 taskFuncs.checkUser(req.body.user, res, next);
})




module.exports = app;
