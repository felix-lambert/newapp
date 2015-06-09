angular.module('InTouch')
  .controller('ActualityAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['$rootScope', '$location', 'appLoading'];

function ActualityAngCtrl($rootScope, $location, appLoading) {
  appLoading.ready();
}
