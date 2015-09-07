angular.module('InTouch')
.controller('ListAnnouncesAngCtrl', ListAnnouncesAngCtrl);

ListAnnouncesAngCtrl.$inject = ['$injector', '$rootScope', '$localStorage'];

function ListAnnouncesAngCtrl($injector, $rootScope, $localStorage) {
    console.log('*************AnnounceCtrl************************');

  var vm              = this;
  
  // Requirements
  var Announce        = $injector.get('Announce');
  var appLoading      = $injector.get('appLoading');
  var preGetAnnounces = $injector.get('preGetAnnounces');
  
  
  vm.paginate         = paginate;
  vm.initListAnnounce = initListAnnounce;
  // vm.like          = like;
  vm.pageChanged      = pageChanged;
  vm.listUsers        = listUsers;
  // vm.search        = search;

  appLoading.ready();

  var announce = new Announce();

  $localStorage.searchField = null;


  vm.page      = 1;
  vm.total     = 0;
  vm.maxSize   = 10;
  vm.searching = false;
  vm.announces = [];

  /////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.page = currentPage;
    vm.paginate(vm.page);
  }
 
  function listUsers() {
    vm.paginate(vm.page);
  }

  var listAnnounces = preGetAnnounces;
  vm.announces = listAnnounces._announces;
  vm.total = listAnnounces._total;

  function paginate() {
    announce.setAnnouncePagination(vm.page);
    announce.getAnnounces().then(function() {
      console.log(announce);
      vm.announces = announce._announces;
      vm.total = announce._total;
    });
  }
}
