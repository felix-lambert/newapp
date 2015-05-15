angular.module('InTouch')
    .controller('transactionModalCtrl', ['$scope', '$modalInstance', 'transac', transactionModalCtrl]);
        
function transactionModalCtrl($scope, $modalInstance, transac) {
  $scope.announce = transac.announce;
  $scope.transac  = transac;
  $scope.submit = function() {
    $modalInstance.close({
      rating:$scope.rating, comment:$scope.comment
    });
  };
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}
