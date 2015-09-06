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
  // function like(announceId, usernameDes, userDesId) {
  //   console.log('like');
  //   vm.suggestions = '';
  //   Notifications.postNotification({
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     type: 'like'
  //   }).then(function(response) {
  //     console.log('notifications success');
  //   });

  //   Like.postLike({
  //     id: announceId,
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     likeType: 'announce'
  //   }).then(function(response) {
  //     console.log('notifications success');
  //   });

  //   vm.paginate(vm.page);
  //   console.log('toaster');
  //   toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
  //   socket.emit('sendLike', {
  //     user: $rootScope.currentUser.username,
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     id: $rootScope.currentUser._id
  //   });
  // }

  // function search() {
  //   Announce.searchAnnounces(vm.searchText).then(function(data) {
  //     console.log(data);
  //     if (data.announces) {
  //       console.log(data.announces.hits.hits);
  //       vm.findResults = data.announces.hits.hits;
  //       vm.searching = true;
  //     }
  //   });
  // }

  function paginate() {
    announce.setAnnouncePagination(vm.page);
    announce.getAnnounces().then(function() {
      console.log(announce);
      vm.announces = announce._announces;
      vm.total = announce._total;
    });
  }
}
