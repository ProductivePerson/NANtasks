angular.module('profile', [])

.controller('ProfileController', function($scope, $http, Proj) {
  angular.extend($scope);
  var canvas = document.getElementById('avatarCanvas');
  var brush = canvas.getContext("2d");
  var img = loadImage("/assets/cat_0.png");
  setTimeout(function() {
    $scope.avatarNum = 0;
    $scope.hatNum = 0;
    $scope.cavatar = img;
    $scope.showAvatar();
  }, 1000);//FIX THIS LATER;


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
      console.log($scope.catHats);
    });
  };

  $scope.toggleCat = function(num) {
    $scope.avatarNum = ($scope.avatarNum+num)%16;
    $scope.cavatar.src = "/assets/cat_" + $scope.avatarNum + ".png";
    $scope.drawHat();
  };

  $scope.showAvatar = function() {
    console.log("Brush and image: ", brush, "\n", $scope.img);
    try {
      brush.drawImage($scope.cavatar, 0, 0);
    }
    catch (TypeError){
      console.log("Error doing the thing");
    }
    // var img = new Image();
    // var img = new Image();
    // img.src = window.location.origin + "/assets/cat_1.png";
    // img.src = window.location.origin + "/assets/cat_1.png";
    // brush.drawImage(img, 0, 0);
    // brush.drawImage(img, 0, 0);
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
      console.log("loadImage: image is ", img);
      return img;
  }

  //sets data on profile-page creation
  $scope.showAvatar();
  $scope.getAssets();
  Proj.getAllUsers()
    .then(function(res) {
      var user = document
        .getElementsByClassName('current-user-greeting')[0]
        .innerHTML.slice(9);

      console.log("User is ", user);
      if (!$scope.user) {
        $scope.user = res.filter(function (userObj) {
          return userObj.username === user;
        });
        $scope.user = $scope.user['0'];
      }
      console.log($scope.user);
    });
});
