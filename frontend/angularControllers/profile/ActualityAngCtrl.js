angular.module('InTouch')
  .controller('ActualityAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['$scope', '$rootScope', '$location', 'appLoading'];

function ActualityAngCtrl($scope, $rootScope, $location, appLoading) {
  appLoading.ready();
}
