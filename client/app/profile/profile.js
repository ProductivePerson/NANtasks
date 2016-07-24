angular.module('profile', [])

.controller('ProfileController', function($scope, $http, Proj) {
  angular.extend($scope);
  var canvas = document.getElementById('avatarCanvas');
  var brush = canvas.getContext("2d");
  var img = loadImage("/assets/cat_1.png");
  setTimeout(function(){
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

  };

  $scope.showAvatar = function() {
    console.log("Brush and image: ", brush, "\n", img);

    brush.drawImage($scope.cavatar, 0, 0);
    // var img = new Image();
    // img.src = window.location.origin + "/assets/cat_1.png";
    // brush.drawImage(img, 0, 0);
  };

  $scope.drawHat = function(hat) {
    var catHat = document.getElementsByClassName('catHat');

    brush.drawImage($scope.cavatar, 0, 0);
    for (var x = 0; x < catHat.length; x++) {
      if (~catHat[x].src.indexOf(hat)) {
        catHat = catHat[x];
        break;
      }
    }
    console.log("Hat is ", hat);
    brush.drawImage(catHat, 23, 10);
  };

  function loadImage(src) {
      // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
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
