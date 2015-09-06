angular.module('InTouch')
  .controller('ActualityAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['$injector', '$localStorage', 'preGetActualities'];

function ActualityAngCtrl($injector, $localStorage, preGetActualities) {
  
  

  var appLoading = $injector.get('appLoading');

  var vm = this;
  
  vm.loadMore = loadMore;

  appLoading.ready();

  $localStorage.searchField = null;
  vm.actualities = preGetActualities;
}
