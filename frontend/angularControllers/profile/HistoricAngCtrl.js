angular.module('InTouch')
  .controller('HistoricAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['$scope', '$rootScope', '$location', 'appLoading'];

function ActualityAngCtrl($scope, $rootScope, $location, appLoading) {
  appLoading.ready();
}
