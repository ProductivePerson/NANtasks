//Declares the main module, which will control the view.
angular.module('fridge', [
  'tasks',
  'groups',
  'profile',
  'services',
  'ui.router',
  'auth',
  'ui.bootstrap',
  'ngAnimate'
])

//configures ui router for single-page application.  Endpoints:
  // "/tasks"
  // "/signin"
  // "/signup"
  // "/groups"
//This is all pretty straightforward stuff, ppl.
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/signin");
  $stateProvider
    .state('/tasks', {
      url: '/tasks',
      templateUrl: 'app/tasks/tasks.html',
      controller: 'TasksController'
    })
    .state('/signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('/signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    }).state('/groups', {
      url: '/groups',
      templateUrl: 'app/groups/groups.html',
      controller: 'GroupController'
    }).state('/profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController'
    });

    //This call to .interceptors.push is how Angular adds middleware
    //to AJAX requests.  In this case we are using the "AttachTokens"
    //factory, which is defined below.
    $httpProvider.interceptors.push('AttachTokens');
})

//Code below is used to attach tokens to each user session.  It also
//verifies that a user is authorised every time the route changes.
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.fridge');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
