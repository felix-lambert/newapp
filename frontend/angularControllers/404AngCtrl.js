angular.module('InTouch')
  .controller('404AngCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {

      $scope.path = $location.path();
      
      $scope.back = function() {
        history.back();
      };
    }
]);
