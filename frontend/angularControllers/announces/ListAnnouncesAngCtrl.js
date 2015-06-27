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
  vm.like               = like;

  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  var allAnnounces = [];
  vm.tags          = [];
  vm.page          = 1;
  vm.limit         = 10;
  vm.total         = 0;
  vm.pageNumbers   = [];

  /////////////////////////////////////////////////////////////

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

  function paginate(page) {

    vm.page = page;
    Announce.getAnnounces({
      page : vm.page,
      limit : vm.limit
    }).then(function(data) {
      console.log('paginate');
      console.log(data);
      vm.announces   = data.announces;
      for (var i = 0; i < vm.announces.length; i++) {
        if (vm.announces[i].title.length > 34) {
          vm.announces[i].title = vm.announces[i].title.substring(0, 35) + '...';
        }
        if (vm.announces[i].content.length > 34) {
          console.log(vm.announces[i].content.length);
          vm.announces[i].content = vm.announces[i].content.substring(0, 35) + '...';
        }
      }
      vm.total       = data.total;
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
