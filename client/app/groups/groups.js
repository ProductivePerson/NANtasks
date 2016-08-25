angular.module('groups', [])

.controller('GroupController', function($scope, $window, $location, Tasks, Auth, Proj, UserTransfer){

  angular.extend($scope, Tasks, Auth, Proj);

  $scope.groupName = $window.localStorage.getItem('group.name');

  var group = $window.localStorage.getItem('group.id');
  var id = $window.localStorage.getItem('id.fridge');
  $scope.usersInGroup = [];
  $scope.allGroupTasks = [];

    $scope.getUserById = function(id) {
    var username;
    $scope.usersInGroup.forEach(function(user) {
      if (user._id === id) {
        username = user.username;
      }
    });
    return username;
  };

  $scope.getMembersData = function(){
    Proj.fetchProjectMembers(group).then(function(resp){
      $scope.usersInGroup = resp.data;
      UserTransfer.setUsers($scope.usersInGroup);
    });
  };
  $scope.getMembersData();

  Proj.fetchProjectMembers(group).then(function(resp){
    $scope.usersInGroup = resp.data;
  });
  //function to get all existed tasks from db
  $scope.getGroupData = function(){
    Proj.fetchAllProjectTasks(group).then(function(resp){
    //  console.log(resp)
      $scope.allGroupTasks = resp.data;
    });
  };
    //initial function call
  $scope.getGroupData();


  //logic used to poke a user.  Gets called as click-handler for the "owner" element
  //of a task.

  $scope.addUser = function(user){
    Proj.addUserToGroup({username: user, groupID: group}).then(function(){
        $scope.userToGroup = null;
        $scope.getMembersData();
    });
  };
  $scope.onSubmit = function(input, toUser){
      var taskData = {
          name: input,
          createdAt: new Date(),
          group: group,
          completed: false,
          owner: toUser ? $scope.usersInGroup.filter(function(user) {
            if (user.username === toUser) {
              console.log("found him! ", user._id);
              return true;
            } else {
              return false;
            }
          })[0]._id : id,
          creator: id
        };
      Tasks.addTask(taskData, function(resp){
        //clear input after task has been added
        $scope.input = null;
        //update task list
        $scope.getGroupData();
      });
  };
  $scope.deleteById = function(task){
    $scope.deleteTask({id: task}, function(resp){
      $scope.getGroupData();
      console.log("got here!", resp);
    });
  };
  $scope.complete = function(task){
    $scope.completeTask({id: task}, function(resp){
      $scope.getGroupData();
    });
  };

  //click handler for poke event
  $scope.poke = function(task, isOn){
    var verify;
    console.log(isOn);
    if (isOn) {
      verify = task.owner;
    } else {
      verify = task.creator;
    }
    if (verify === id) {
      $scope.pokeTask({id: task}, function(resp){
        $scope.getGroupData();
      });
    } else {
      alert("you do not have the authority to poke that user!");
    }
  };


  $scope.relocate = function () {
        $location.path('/tasks');
  };


  $scope.deleteUserFromGroup = function(userID){
    console.log(userID, group);
    Proj.deleteUserByID({id: userID, groupID: group}).then(function(resp){
      $scope.getMembersData();
    });

  };



});
