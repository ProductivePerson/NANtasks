angular.module('profile', ['ui.bootstrap','ngAnimate'])
.controller('ProfileController', function($scope, $uibModal, $log, $window, $http, Proj) {

  var username = $window.localStorage.getItem('user.fridge');
  $scope.username = username[0].toUpperCase() + username.slice(1).toLowerCase();
  $scope.uID = $window.localStorage.getItem('id.fridge');
  $scope.password = "password";
  console.log('profile stuff', $scope.username, $scope.uID, $scope.password);
  $scope.items = [$scope.username, 'password'];

  $scope.animationsEnabled = true;

  var canvas = document.getElementById('avatarCanvas');
  var brush = canvas.getContext("2d");
  var img = loadImage("/assets/cat_0.png");
  $scope.avatarNum = 0;
  $scope.hatNum = 0;
  $scope.cavatar = img;

  // setTimeout(function() {
  //   $scope.showAvatar();
  // }, 1000);//FIX THIS LATER;

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'profile.html',
      controller: 'ProfileInstanceCtrl',
      size: size,
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  $scope.toggleCat = function(num) {
    $scope.avatarNum = ($scope.avatarNum+num)%16;
    $scope.cavatar.src = "/assets/cat_" + $scope.avatarNum + ".png";
    $scope.drawHat();
  };

  $scope.showAvatar = function() {
    try {
      brush.drawImage($scope.cavatar, 0, 0);
    }
    catch (TypeError){
      console.log("Caught: Error rendering Avatar.");
    }
  };
  $scope.setHat = function(hat) {
    $scope.hatNum = hat;
    $scope.drawHat();
  };
  $scope.drawHat = function() {
    var catHat = document.getElementsByClassName('catHat');
    brush.drawImage($scope.cavatar, 0, 0);
    if ($scope.hatNum > 0) {
      brush.drawImage(catHat[$scope.hatNum], 23, 10);
    }
  };

  function loadImage(src) {
      var img = new Image();

      img.onload = $scope.showAvatar;
      img.src = src;
      return img;
  }
  $scope.getAssets = function() {
    $http({
      method:"GET",
      url: window.location.origin + "/api/allAssets/"
    }).then(function(resp) {
      $scope.catHats = resp.data.filter(function (file) {
        return !!~file.indexOf('hat');
      });
      $scope.catheads = resp.data
        .filter(function (file) {
          return !!~file.indexOf('cat');
        }).map(function (file) {
          var image = new Image();
          image.src = "/assets/" + file;
          return image;
        });
    });
  };
  //sets data on profile-page creation
  $scope.getAssets();
  Proj.getAllUsers()
    .then(function(res) {
      var user = document
        .getElementsByClassName('current-user-greeting')[0]
        .innerHTML.slice(9);

      if (!$scope.user) {
        $scope.user = res.filter(function (userObj) {
          return userObj.username === user;
        });
        $scope.user = $scope.user['0'];
      }
      // console.log($scope.user);
    });
})

.controller('ProfileInstanceCtrl', function ($scope, $uibModalInstance, $window, items) {

  var username = $window.localStorage.getItem('user.fridge');
  $scope.username = username[0].toUpperCase() + username.slice(1).toLowerCase();
  $scope.uID = $window.localStorage.getItem('id.fridge');
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
