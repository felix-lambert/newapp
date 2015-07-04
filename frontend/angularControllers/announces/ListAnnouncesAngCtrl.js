angular.module('InTouch')
.controller('ListAnnouncesAngCtrl', ListAnnouncesAngCtrl);

ListAnnouncesAngCtrl.$inject = ['$injector', '$http', '$rootScope'];

function ListAnnouncesAngCtrl($injector, $http, $rootScope) {

  var vm = this;

  // Requirements
  var Announce          = $injector.get('Announce');
  var appLoading        = $injector.get('appLoading');

  console.log('*************AnnounceCtrl************************');
  vm.decorateNumberPage = decorateNumberPage;
  vm.paginate           = paginate;
  vm.initListAnnounce   = initListAnnounce;
  vm.like               = like;
  vm.pageChanged        = pageChanged;
  vm.listUsers          = listUsers;
  vm.search             = search;

  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  var allAnnounces  = [];
  vm.tags           = [];
  vm.page           = 1;
  vm.total          = 0;
  vm.pageNumbers    = [];
  vm.maxSize        = 10;
  vm.bigTotalItems  = 175;
  vm.bigCurrentPage = 1;
  vm.searching      = false;

  /////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.page = currentPage;
    vm.paginate(vm.page);
  }

  function listUsers() {
    vm.paginate(vm.page);
  }

  function like(announceId, usernameDes, userDesId) {
    console.log('like');
    vm.suggestions = '';
    Notifications.postNotification({
      userDes: usernameDes,
      userDesId: userDesId,
      type: 'like'
    }).then(function(response) {
      console.log('notifications success');
    });

    Like.postLike({
      id: announceId,
      userDes: usernameDes,
      userDesId: userDesId,
      likeType: 'announce'
    }).then(function(response) {
      console.log('notifications success');
    });

    vm.paginate(vm.page);
    console.log('toaster');
    toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
    socket.emit('sendLike', {
      user: $rootScope.currentUser.username,
      userDes: usernameDes,
      userDesId: userDesId,
      id: $rootScope.currentUser._id
    });
  }

  function decorateNumberPage(page, decoration, weight) {
    $('#bt' + page).css('text-decoration', decoration);
    $('#bt' + page).css('font-weight', weight);
  }

  function search() {
    Announce.searchAnnounces(vm.searchText).then(function(data) {
      console.log(data);
      if (data.announces) {
        console.log(data.announces.hits.hits);
        vm.findResults = data.announces.hits.hits;
        vm.searching = true;
      }
    });
  }

  function paginate(page) {

    vm.page = page;
    Announce.getAnnounces({
      page : vm.page,
      limit : vm.maxSize
    }).then(function(data) {
      console.log('paginate');
      console.log(data);
      vm.announces   = data.announces;
      console.log(vm.announces);
      for (var i = 0; i < vm.announces.length; i++) {
        if (vm.announces[i].title.length > 34) {
          vm.announces[i].title = vm.announces[i].title.substring(0, 35) + '...';
        }
        if (vm.announces[i].content.length > 34) {
          console.log(vm.announces[i].content.length);
          vm.announces[i].content = vm.announces[i].content.substring(0, 35) + '...';
        }
      }
      vm.total = data.total;
    });
  }
  function initListAnnounce() {
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    vm.paginate(vm.page);
  }
}
