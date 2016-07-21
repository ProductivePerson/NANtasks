angular.module('fridge', [
  'tasks',
  'groups',
  'services',
  'ui.router',
  'auth'
])

// ui router for single-page application
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
    })

    $httpProvider.interceptors.push('AttachTokens');
})

// CODE BELOW WILL BE USED FOR ATTACHING TOKENS TO EACH USER SESSION
// AND TO VERIFY THAT A USER IS AUTHORIZED EVERY TIME THE ROUTE CHANGES

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
