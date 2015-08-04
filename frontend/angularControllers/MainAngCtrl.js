angular.module('InTouch')
  .controller('MainAngCtrl', MainAngCtrl)
  .controller('OtherController', OtherController);

MainAngCtrl.$inject = ['$http', '$scope', '$injector', '$location',
'$rootScope', '$localStorage'];

function MainAngCtrl($http, $scope, $injector, $location, $rootScope, $localStorage) {

  console.log('*****mainctrl******');

  var vm         = this;

  // Requirements
  var Auth                  = $injector.get('Auth');
  var appLoading            = $injector.get('appLoading');
  var Announce              = $injector.get('Announce');
  
  var announce = new Announce();
  var auth = new Auth();

  vm.register               = register;
  vm.Search                 = Search;
  vm.paginate               = paginate;
  vm.searchPaginate         = searchPaginate;
  vm.initListAnnounce       = initListAnnounce;
  // vm.like                   = like;
  vm.pageChanged            = pageChanged;

  appLoading.ready();

  vm.tabs = {
    active: 0
  };

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  
  vm.page        = 1;
  vm.total       = 0;
  vm.searchState = false;
  vm.announces   = [];
  vm.currentPage = 1;
  vm.currentPage = 1;
  vm.pageSize = 10;

  vm.searchField = $localStorage.searchField ? $localStorage.searchField : null;

  if (vm.searchField) {
    console.log('inside searchField');
    console.log(announce);
    announce.setSearchField({searchField : vm.searchField});
    announce.pressSearchAnnounces()
    .then(function() {
      vm.searchState            = true;

      vm.announces = announce._announces;
      vm.total = announce._total;
    });
  }
  /////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    vm.page = currentPage;
    if (vm.searchState === false) {
      console.log('paginate');
      vm.paginate(vm.page);
    }
  }

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

  function Search() {
    console.log('search');
    var vm = this;
    vm.dataLoading = true;
    if (vm.searchField) {
      $localStorage.searchField = vm.searchField;
      console.log($scope.$storage);
      vm.searchTerm = vm.searchField;
      console.log('yes');
      announce.setSearchField({searchField : vm.searchField});
      announce.pressSearchAnnounces()
      .then(function() {
        vm.searchState    = true;
        vm.announces = announce._announces;
        vm.total = announce._total;
      });
    } else {
      vm.searchState    = false;
      $localStorage.searchField = null;
      vm.paginate(vm.page);
    }
  }

  function searchPaginate() {
    console.log('__________pagination__________');
    console.log(vm.searchTerm);
    console.log(vm.page);
    vm.searchState    = true;
    console.log($rootScope.searchAnnonces);
    console.log('end search');
  }

  function paginate(page) {
    vm.page = page;
    announce.setAnnouncePagination(vm.page);
    announce.getAnnounces().then(function() {
      console.log(announce._announces);
      vm.announces = announce._announces;
      vm.total = announce._total;
    });
  }
  
  function initListAnnounce() {
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    if (!vm.searchField) {
      vm.paginate(vm.page);
    }
  }

  function register() {
    console.log('**************register*********************');
    console.log(this);
    var vm = this;
    vm.dataLoading = true;
    auth.setRegisterField(vm.username, vm.email, vm.password, vm.passwordConfirmation);
    auth.createUser().then(function() {
      if (auth._error) {
        swal(auth._error, 'Try again', 'warning');
      } else {
        swal('Votre compte a été créé avec succès', '', 'success');
        $rootScope.currentUser.notificationsCount = 0;
        $location.path('/');
      }
    });
  }
}

function OtherController($scope) {
  $scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
}