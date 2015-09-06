angular.module('InTouch')
  .controller('HistoricAngCtrl', ActualityAngCtrl);

HistoricAngCtrl.$inject = ['appLoading', '$localStorage'];

function HistoricAngCtrl(appLoading, $localStorage) {
  appLoading.ready();
  $localStorage.searchField = null;
}
