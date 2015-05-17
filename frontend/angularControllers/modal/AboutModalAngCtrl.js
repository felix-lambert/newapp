angular.module('InTouch')
    .controller('AboutModalAngCtrl', AboutModalAngCtrl);

AboutModalAngCtrl.$inject = ['$scope', '$modalInstance'];

function AboutModalAngCtrl($scope, $modalInstance) {
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
