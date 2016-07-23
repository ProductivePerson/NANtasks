angular.module('profile', ['ui.bootstrap','ngAnimate'])
.controller('ProfileController', function($scope, $uibModal, $log, $window) {

  $scope.username = $window.localStorage.getItem('user.fridge');
  $scope.uID = $window.localStorage.getItem('id.fridge');
  $scope.password = "password";
  console.log('profile stuff', $scope.username, $scope.uID, $scope.password);
  $scope.items = ['username', 'password'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {
    alert("coming from profile: stop clicking me!");

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

})

.controller('ProfileInstanceCtrl', function ($scope, $uibModalInstance, items) {

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
