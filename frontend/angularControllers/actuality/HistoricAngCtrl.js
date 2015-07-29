angular.module('InTouch')
  .controller('HistoricAngCtrl', ActualityAngCtrl);

HistoricAngCtrl.$inject = ['$rootScope', '$location', 'appLoading', '$localStorage'];

function HistoricAngCtrl($rootScope, $location, appLoading, $localStorage) {
  appLoading.ready();
  $localStorage.searchField = null;
}
