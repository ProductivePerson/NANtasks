angular.module('tasks', [])

.controller('TasksController', function($scope, $window, $location, Tasks, Auth, Proj){

  angular.extend($scope, Tasks, Auth);
  $scope.cUser = $window.localStorage.getItem('user.fridge');
  $scope.uID = $window.localStorage.getItem('id.fridge');
  if(!Auth.isAuth()) { Auth.signout()}
  //will be submitted to server in POST request body containing the new task input data
    //when ready to send requests to server, add "Tasks" controller as function input variable
  $scope.allTasks = [];
  $scope.all;

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
    })
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

  $scope.relocate = function (group, id) {
    $window.localStorage.setItem('group.id', id);
    $window.localStorage.setItem('group.name', group);
    $location.path('/groups');
  }

  //function to get all existed tasks from db
  $scope.getData = function(){
    $scope.all = $scope.getUserTasks({user: $scope.uID});
    $scope.all.then(function(resp){
    //  console.log(resp)
      $scope.allTasks = resp;
    })
  }
    //initial function call
    $scope.getData();


    //add Task to user(current user or assign to another user)
    $scope.addTaskTo = function(input, userID){
      var projID = $window.localStorage.getItem('proj.id.fridge');
      var taskData = {
          name: input,
          createdAt: new Date(),
          group: projID,
          completed: false,
          owner:userID
        };
      Tasks.addTask(taskData, function(resp){
        //clear input after task has been added
        $scope.input = null;
        //update task list
        $scope.getData();
      })
    }

    $scope.onSubmit = function(input, toUser){
    if(toUser){
      //if we assigning task to user, we need to make async call to check if this user exist ni db and send userid to the client
      $scope.isUser({user: toUser}).then(function(resp){
        $scope.addTaskTo(input, resp);
      })
    } else {
       $scope.addTaskTo(input, $scope.uID);
    }
  }

  $scope.deleteById = function(task){
    $scope.deleteTask({id: task}, function(resp){
      $scope.getData();
    });
  }
  $scope.complete = function(task){
    $scope.completeTask({id: task}, function(resp){
      $scope.getData();
    });
  }
})
