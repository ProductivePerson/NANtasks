angular.module('groups', [])

.controller('GroupController', function($scope, $window, $location, Tasks, Auth, Proj){

  angular.extend($scope, Tasks, Auth, Proj);
  var group = $window.localStorage.getItem('group.id');
  var id = $window.localStorage.getItem('id.fridge');
  $scope.usersInGroup = [];
  $scope.allGroupTasks = [];

  $scope.getMembersData = function(){
    Proj.fetchProjectMembers(group).then(function(resp){
      $scope.usersInGroup = resp.data;
    });
  }
  $scope.getMembersData();

  Proj.fetchProjectMembers(group).then(function(resp){
    $scope.usersInGroup = resp.data;
  });
  //function to get all existed tasks from db
  $scope.getGroupData = function(){
    Proj.fetchAllProjectTasks(group).then(function(resp){
    //  console.log(resp)
      $scope.allGroupTasks = resp.data;
    })
  }
    //initial function call
  $scope.getGroupData();

  $scope.addUser = function(user){
    console.log(user, group);
    Proj.addUserToGroup({username: user, groupID: group}).then(function(){
        $scope.userToGroup = null;
        $scope.getMembersData();
    });
  }
  $scope.onSubmit = function(input){
      var taskData = {
          name: input,
          createdAt: new Date(),
          group: group,
          completed: false,
          owner:id
        };
        console.log('point', taskData);
      Tasks.addTask(taskData, function(resp){
        //clear input after task has been added
        $scope.input = null;
        //update task list
        $scope.getGroupData();
      })
  }
  $scope.deleteById = function(task){
    $scope.deleteTask({id: task}, function(resp){
      $scope.getGroupData();
    });
  }
  $scope.complete = function(task){
    $scope.completeTask({id: task}, function(resp){
      $scope.getGroupData();
    });
  }
  $scope.relocate = function () {
        $location.path('/tasks');
  }


})
