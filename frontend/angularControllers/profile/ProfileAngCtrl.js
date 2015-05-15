angular.module('InTouch')
  .controller('ProfileAngCtrl', ['$scope', '$rootScope', 'Status',
    ProfileAngCtrl]);

function ProfileAngCtrl($scope, $rootScope, Status) {

  $scope.status = [];

  $scope.removeStatus = function(status) {
    console.log(status);
    Status.removeStatus(status._id).then(function(res) {
      for (var i in $scope.status) {
        if ($scope.status[i] == status) {
          $scope.status.splice(i, 1);
        }
      }
    });
  };

  $scope.getStatus = function() {
    Status.getStatus($rootScope.currentUser._id)
    .then(function(res) {
      console.log('GET STATUS');
      console.log(res);
      $scope.status = res;
    });
  };

  $scope.postStatus = function() {
    if ($scope.txtcomment !== '') {
      Status.postStatus({
        content: $scope.txtcomment
      }, $rootScope.currentUser._id).then(function(res) {
        $scope.getStatus();
        $scope.txtcomment = '';
      });

    }
  };

  $scope.initStatus = function() {
    console.log('__STatusCtrl__');
    $scope.getStatus();
  };

}
