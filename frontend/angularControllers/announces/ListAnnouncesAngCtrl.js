angular.module('InTouch')
.controller('ListAnnouncesAngCtrl', ListAnnouncesAngCtrl);

ListAnnouncesAngCtrl.$inject = ['Announce', '$http', '$rootScope', 'appLoading'];

function ListAnnouncesAngCtrl(Announce, $http, $rootScope, appLoading) {

  var vm = this;

  console.log('*************AnnounceCtrl************************');
 
  vm.decorateNumberPage = decorateNumberPage;
  vm.paginate           = paginate;
  vm.previous           = previous;
  vm.next               = next;
  vm.initListAnnounce   = initListAnnounce;


  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    console.log($rootScope.currentUser.images);
  }

  var allAnnounces = [];
  vm.tags = [];

  vm.page = 1;
  vm.limit = 10;
  vm.total = 0;
  vm.pageNumbers = [];

  /////////////////////////////////////////////////////////////

  function decorateNumberPage(page, decoration, weight) {
    $('#bt' + page).css('text-decoration', decoration);
    $('#bt' + page).css('font-weight', weight);
  }

  function paginate(page) {

    vm.page = page;
    Announce.paginate({
      page : vm.page,
      limit : vm.limit
    }, function(data) {
      console.log(data);
      vm.announces = data.announces;
      vm.total = data.total;
      vm.pageNumbers = [];
      for (var i = 0; i < vm.total; i++) {
        vm.pageNumbers.push(i + 1);
      }
    });
    angular.forEach(vm.pageNumbers, function(page, key) {
      vm.decorateNumberPage(page, 'none', 'normal');
    });
    vm.decorateNumberPage(page, 'underline', 'bold');
  }

  function previous() {
    if (vm.page > 1) {

      vm.page--;
    }
    vm.paginate(vm.page);
  }

  function next() {
    console.log(vm.page);
    console.log(vm.total);
    if (vm.page < vm.total) {
      vm.page++;
    }
    vm.paginate(vm.page);
  }

  function initListAnnounce() {
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    vm.paginate(vm.page);
  }

}
