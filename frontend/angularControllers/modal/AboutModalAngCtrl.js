angular.module('InTouch')
    .controller('AboutModalAngCtrl', ['$scope', '$modalInstance', AboutModalAngCtrl]);

function AboutModalAngCtrl($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
