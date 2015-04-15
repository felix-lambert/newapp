angular.module('InTouch')
    .controller('AboutModalAngCtrl', ['$scope', '$modalInstance',
        function($scope, $modalInstance) {
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        }
]);
