angular.module('InTouch')
  .controller('HistoricAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['$rootScope', '$location', 'appLoading'];

function ActualityAngCtrl($rootScope, $location, appLoading) {
  appLoading.ready();
  $localStorage.searchField = null;
}
