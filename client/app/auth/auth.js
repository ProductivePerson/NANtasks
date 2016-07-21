angular.module('auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  //$scope.currentUser = Auth.currUser.user.username;
  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (res) {
        console.log(res);
        $window.localStorage.setItem('com.fridge', res.token);
        $window.localStorage.setItem('user.fridge', res.user.username);
        $window.localStorage.setItem('id.fridge', res.user.id);
        $location.path('/tasks');
      })
      .catch(function (error) {
        var result = document.getElementsByClassName("auth-error");
        var wrappedResult = angular.element(result)
        wrappedResult.addClass('show-auth-error');
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (res) {
        console.log("resopnse from server", res);
        $window.localStorage.setItem('com.fridge', res.token);
        $window.localStorage.setItem('user.fridge', res.user.username);
        $window.localStorage.setItem('id.fridge', res.user.id);
        $location.path('/tasks');
      })
      .catch(function (error) {
        console.error("Signup error: ", error);
        var result = document.getElementsByClassName("auth-error");
        var wrappedResult = angular.element(result)
        wrappedResult.addClass('show-auth-error');
      });
  };
  //When 'logout' is clicked, signout() function removes token from local storage
  //and redirects user to /signin
  $scope.signout = function(){
    console.log('logout clicked');
    Auth.signout();
  };
});
