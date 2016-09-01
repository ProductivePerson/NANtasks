angular.module('profile', ['ui.bootstrap','ngAnimate'])
//this controller is for the maine frame of the modal for the profile control
.controller('ProfileController', function($scope, $uibModal, $log, $window, Avatar, Proj, Tasks, Profile) {

  angular.extend($scope, Profile);

  var username = $window.localStorage.getItem('user.fridge');
  $scope.username = username[0].toUpperCase() + username.slice(1).toLowerCase();
  console.log("Username is ", $scope.username);
  $scope.uID = $window.localStorage.getItem('id.fridge');
  $scope.password = "password";
  console.log('profile stuff', $scope.username, $scope.uID, $scope.password);

  $scope.animationsEnabled = true;

  $scope.loadStuff = function() {
    Avatar.init();
    var user = $window.localStorage.getItem('user.fridge');
    Proj.getOneUser(user, function(res) {
      // $scope.user = res;
      Avatar.drawLocalAvatar(res.avatar[0], res.avatar[1]);
    });
  };
  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'profile.html',
      controller: 'ProfileInstanceCtrl',
      size: size,
      // resolve: {
      //   items: function() {
      //     return $scope.items;
      //   }
      // }
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };


})

//this controller is what gets rendered inside the modal
.controller('ProfileInstanceCtrl', function ($scope, $uibModalInstance, $window, $http, Proj, Avatar, Profile) {


  angular.extend($scope, Profile);

  $scope.showForm = false;
  $scope.showName = true;

  $scope.usernameClicked = function() {
    $scope.showName = !$scope.showName;
    $scope.showForm = !$scope.showForm;
  };

  var username = $window.localStorage.getItem('user.fridge');
  $scope.username = username[0].toUpperCase() + username.slice(1).toLowerCase();
  $scope.uID = $window.localStorage.getItem('id.fridge');
  // $scope.items = items;

  $scope.updateName = function(newUsername) {
    Profile.updateUsername($scope.username, newUsername);
    $scope.username = newUsername;
    $scope.usernameClicked();
    console.log('newUsername', newUsername);
  };

  $scope.init = function () {
    $scope.catHats = Avatar.getCatHats().map(function (img) {
        console.log("fixing it now. img is ", img.src);
      return img.src.slice(29);
    });
    var user = document
      .getElementsByClassName('current-user-greeting')[0]
      .innerHTML.slice(7);
    Proj.getOneUser(user, function(res) {
      $scope.user = res;
      $scope.avatarNum = res.avatar[0];
      $scope.hatNum = res.avatar[1];
    });
    Avatar.drawAvatarOnProfile();
  };

  $scope.ok = function () {
    Avatar.saveAvatar($scope.user.username);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.toggleCat = function(num) {
    Avatar.toggleCat(num);
  };
  $scope.setHat = function(hat) {
    Avatar.setHat(hat);
  };
});
