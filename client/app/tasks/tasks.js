angular.module('tasks', [])

.controller('TasksController', function($scope, $window, $location, Tasks, Auth, Proj, UserTransfer){

  angular.extend($scope, Tasks, Auth, Proj);

  $scope.usersInGroup = [];
  $scope.signedInUsersTog = true;
  //get all users, then shove them in usersInGroup.
  Proj.getAllUsers()
    .then(function(res) {
      if ($scope.usersInGroup.length < 1) {
        $scope.usersInGroup = res;
      }
    });
  //gets username

  $scope.cUser = $window.localStorage.getItem('user.fridge');
  //gets user ID
  $scope.uID = $window.localStorage.getItem('id.fridge');
  if(!Auth.isAuth()) { Auth.signout();}
  //will be submitted to server in POST request body containing the new task input data
    //when ready to send requests to server, add "Tasks" controller as function input variable
  $scope.allTasks = [];
  $scope.createdTasks = [];

  //PROJECT FUNCTIONALITY
  //initially set current group to general tasks and change as other project links are clicked

  $scope.currentProjName = $window.localStorage.setItem('proj.name.fridge', 'All Tasks');

  $window.localStorage.setItem('proj.id.fridge', undefined);

  $scope.currentProjName = [$window.localStorage.getItem('proj.name.fridge')];

  //new project container that is sent to server when user presses enter in 'Add New Proj' input form
  $scope.project = {};
  //all members of a project. loaded and populated whenever a project link is clicked
  $scope.members = [];
  //array of all projects, which is formatted as a list in sidebar
  $scope.allProjects = [];

  $scope.getUserById = function(id) {
    var username;
    $scope.usersInGroup.forEach(function(user) {
      if (user._id === id) {
        username = user.username;
      }
    });
    return username;
  };

  //add new project to sidebar list and to db
  $scope.addProject = function(){
    Proj.addProject($scope.project, $scope.cUser)
    .then(function(proj){
      $scope.loadProjList();
    });
    //resets input form to be blank after submission
    $scope.project = {};
  };

  //function to populate sidebar task list when page is loaded
  $scope.loadProjList = function(){
    Proj.getUserProjectsList($scope.cUser)
    .then(function(projList){
      $scope.allProjects = projList.data;
    });
  };
  //func is called as soon as page loads
  $scope.loadProjList();

  //add new project to sidebar list and to db
  $scope.addProject = function(){
    Proj.addProject($scope.project, $scope.cUser)
    .then(function(proj){
      $scope.loadProjList();
      //resets input form to be blank after submission
      $scope.project = null;
    });
  };

  //this function called whenever a project link is clicked in sidebar list
  $scope.renderProjView = function(id, name){
    $window.localStorage.setItem('proj.name.fridge', name);
    $window.localStorage.setItem('proj.id.fridge', id);
    $scope.currentProjName = [$window.localStorage.getItem('proj.name.fridge')];

    //first step is to clear the DOM of all tasks so that it can be repopulated with
    //the tasks of the selected project

    taskListPending.empty();
    taskListComplete.empty();
    $scope.allTasks = [];

    //it will fetch the tasks and the group members of the project link clicked

    // Proj.fetchAllProjectTasks(id)
    //   .then(function(tasks){
    //     //subsequently, the $scope.tasks array will be populated with the tasks of
    //     //the specified group
    //     $scope.allTasks = tasks;
    //   });

    Proj.fetchProjectMembers(id)
      .then(function(members){
        //$scope.members will be populated with members of group
        $scope.members = members;
      });
  };
  ////////////////////////////////////

  //logic used to poke a user.  Gets called as click-handler for the "owner" element
  //of a task.
  $scope.poke = function(task, isOn){
    var verify;
    if (isOn) {
      verify = task.owner;
    } else {
      verify = task.creator;
    }
    if (verify === $scope.uID) {
      $scope.pokeTask({id: task}, function(resp){
        $scope.getData();
        $scope.getCreatedData();
      });
    } else {
      alert("you do not have the authority to poke that user!");
    }
  };

  $scope.relocate = function (group, id) {
    $window.localStorage.setItem('group.id', id);
    $window.localStorage.setItem('group.name', group);
    $location.path('/groups');
  };

  //function to get all existed tasks from db
  $scope.getData = function(){
    $scope.all = $scope.getUserTasks({user: $scope.uID});
    $scope.all.then(function(resp){
    //  console.log(resp)
      $scope.allTasks = resp;
    });
  };
  //initial function call
  $scope.getData();

  //as above, but gets the tasks that the user created.
  $scope.getCreatedData = function(){
    $scope.getCreatedTasks({user: $scope.uID}).then(function(resp){
    //  console.log(resp)
      $scope.createdTasks = resp;
    });
  };
  //initial function call
  $scope.getCreatedData();

    //add Task to user(current user or assign to another user)
    $scope.addTaskTo = function(input, userID){
      var projID = $window.localStorage.getItem('proj.id.fridge');
      var taskData = {
          name: input,
          createdAt: new Date(),
          group: projID,
          completed: false,
          poked: false,
          owner:userID,
          creator: $scope.uID,
        };
      Tasks.addTask(taskData, function(resp){
        //clear input after task has been added
        $scope.input = null;
        //update task list
        $scope.getData();
        $scope.getCreatedData();
      });
    };

    $scope.onSubmit = function(input, toUser){
    if(toUser){ // if optional 'user' field is specified
      //if we are assigning task to user, we need to make async call to check if this user exist in db and send userid to the client
      $scope.isUser({user: toUser}).then(function(resp){  //check for user.
        $scope.addTaskTo(input, resp);  //add task to DB with target user as owner
      });
    } else { //else if 'user' field is blank
       $scope.addTaskTo(input, $scope.uID);  //add task to DB with current user as owner
    }
  };

  $scope.deleteById = function(task){
    $scope.deleteTask({id: task}, function(resp){
      $scope.getData();
      $scope.getCreatedData();
    });
  };
  $scope.complete = function(task){
    $scope.completeTask({id: task}, function(resp){
      $scope.getData();
      $scope.getCreatedData();
    });

  };


  $scope.deleteGroup = function(groupID){
    Proj.deleteGroupbyID({id: groupID}).then(function(proj){
      $scope.loadProjList();
    });

  };



  //set watch statement
  $scope.$watch(function () { return UserTransfer.getUsers(); }, function (newValue, oldValue) {
        if (newValue !== null) {
            //update Controller2's usersInGroup value based on the "UserTransfer" service's value.
            $scope.usersInGroup = newValue;
        }
  }, true);
  // $scope.open = function(string){
  //   alert("this is gonna be weird");
  // };

  $scope.signedin = function(){
    Auth.signedin()
      .then(function(data){
        $scope.signedInUsers = data;
        // console.log(data);
      });
  };

});
