angular.module('services', [])

.factory('Tasks', function ($http) {

  var isUser = function(username){
   //console.log("I am in services", username);
   return $http({
     method: 'POST',
     url: '/api/user/check',
     data: username
   }).then(function(resp){
     //console.log("data from server", resp.data);
     return resp.data;
   })
 };

  var getUserTasks = function(user){
      return $http({
        method: 'POST',
        url: '/api/user/usertasks',
        data: user
      }).then(function(resp){
        //console.log(resp.data);
        return resp.data;
      })
    };

    var fetchAllTasks = function(){
        return $http({
          method: 'GET',
          url: '/api/tasks'
        }).then(function(resp){
          return resp.data;
        })
      };

  var addTask = function(task, callback){
    console.log('working', task);
    return $http({
      method: 'POST',
      url: '/api/tasks',
      data: task
    }).then(function(resp){
      console.log("here is response from server", resp)
      //using callback to update our tasks ONLY after respond
      callback(resp);
      //return resp;
    })
    .catch(function(err){
      console.err("Error adding task: ", err);
    })
  };

  var deleteTask = function(task, callback){
     return $http({
       method: 'POST',
       url: '/api/tasks/delete',
       data: JSON.stringify(task)
     }).then(function(resp){
       //using callback to update our tasks ONLY after respond
       callback(resp);
     }).catch(function(err){
       console.log('Error', err);
     })
   };

   var completeTask = function(task, callback){
     return $http({
       method: 'PUT',
       url: '/api/tasks',
       data: task
     }).then(function(resp){
       //using callback to update our tasks ONLY after respond
       callback(resp);
     }).catch(function(err){
       console.log('Error', err);
     })
   };

  return {
    fetchAllTasks:fetchAllTasks,
    getUserTasks:getUserTasks,
    addTask: addTask,
    deleteTask:deleteTask,
    completeTask: completeTask,
    isUser:isUser
  }

})

.factory('Proj', function($http){
  //function to add new project to the projects list in index.html sidebar
  var addProject = function(project, user){
    project.username = user;
    return $http({
      method: 'POST',
      url: '/api/createGroup',
      data: project
    })
    .then(function(resp){
      //return group object sent back from server
      return resp;
    })
    .catch(function(err){
      console.error(err);
    })
  };

  var addUserToGroup = function(user){
    return $http({
      method: 'PUT',
      url: '/api/group/addUser',
      data: user
    })
    .then(function(resp){
      //return group object sent back from server
      console.log('get response on add new user', resp)
      return resp;
    })
    .catch(function(err){
      console.error(err);
    })
  };

  var fetchAllProjectTasks = function(id){
    return $http({
      method: 'POST',
      url: "/api/group/getTasks",
      data: {groupID: id}
    })
    .then(function(resp){
      return resp;
    })
    .catch(function(err){
      console.error("Error fetching all group tasks: ", err)
    })
  };
  var fetchProjectMembers = function(id){
    return $http({
      method: 'POST',
      url: '/api/group/getUsers',
      data: {groupID: id}
    })
    .then(function(resp){
      return resp;
    })
    .catch(function(err){
      console.error(err)
    })
  };
  var getUserProjectsList = function(user){
    return $http({
      method: "POST",
      url: "/api/user/getGroups",
      data: {username: user}
    })
    .then(function(resp){
      return resp;
    })
    .catch(function(err){
      console.error(err)
    })
  };

  return {
    addUserToGroup:addUserToGroup,
    addProject: addProject,
    fetchAllProjectTasks: fetchAllProjectTasks,
    fetchProjectMembers: fetchProjectMembers,
    getUserProjectsList: getUserProjectsList
  }
})

.factory('Auth', function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    })

  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    })
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.fridge');
  };

  var signout = function () {
    $window.localStorage.removeItem('user.fridge');
    $window.localStorage.removeItem('id.fridge');
    $window.localStorage.removeItem('com.fridge');

    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
