angular.module('InTouch')
.controller('CreateAnnounceAngCtrl', CreateAnnounceAngCtrl);

CreateAnnounceAngCtrl.$inject = ['$timeout', '$localStorage', '$scope', '$http', 'announces',
'$rootScope', 'toaster', '$modal', 'appLoading'];

function CreateAnnounceAngCtrl($timeout, $localStorage, $scope,
  $http, announces, $rootScope, toaster,
  $modal, appLoading) {

  console.log('*************AnnounceCtrl************************');

  var vm = this;

  console.log(vm);

  vm.decorateNumberPage     = decorateNumberPage;
  vm.paginateUser           = paginateUser;
  vm.listUsers              = listUsers;
  vm.previousUser           = previousUser;
  vm.nextUser               = nextUser;
  vm.reset                  = reset;
  vm.range                  = range;
  vm.create                 = create;
  vm.remove                 = remove;
  vm.desactivate            = desactivate;
  vm.activate               = activate;
  vm.findFromUser           = findFromUser;
  vm.initListCreateAnnounce = initListCreateAnnounce;

  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  var allAnnounces = [];
  vm.tags = [];

  vm.page = 1;
  vm.limit = 5;
  vm.total = 0;
  vm.pageNumbers = [];

  ////////////////////////////////////////////////////////////////////////

  function decorateNumberPage(page, decoration, weight) {
    $('#bt' + page).css('text-decoration', decoration);
    $('#bt' + page).css('font-weight', weight);
  }

  function paginateUser(page) {
    console.log('paginate user announces');
    vm.page = page;
    if ($rootScope.currentUser) {
      announces.getAnnouncesFromUser({
          page : vm.page,
          limit : vm.limit,
          user: $rootScope.currentUser._id
      }).then(function(data) {
        console.log('______________________________________');

        vm.announces = data.announces;

        console.log(vm);
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
  }

  function listUsers() {
    vm.paginate($scope.page);
  }

  function previousUser() {
    if (vm.page > 1) {
      vm.page--;
    }
    vm.paginateUser(vm.page);
  }

  function nextUser() {
    if (vm.page < vm.total) {
      vm.page++;
    }
    vm.paginateUser(vm.page);
  }

  function reset() {
    vm.successMessage = null;
    vm.errorMessage = null;
    vm.nameErrorMessage = null;
    vm.usernameErrorMessage = null;
    vm.passwordErrorMessage = null;
    vm.listUsers();
  }

  function range(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  }

  function create() {
    console.log('create');
    if ($rootScope.currentUser) {
      vm = this;
      announces.postAnnounce({
        title: vm.title,
        content: vm.content,
        type: vm.type,
        category: vm.category,
        price: vm.price,
        images: vm.selectedImages,
        activated: true,
        tags: vm.data.tags
      }).then(function(response) {
        console.log(response);
        vm.title = '';
        vm.content = '';
        vm.paginateUser(vm.page);
        vm.title = '';
        vm.category = '';
        vm.type = '';
      });
    } else {
      var modalInstance = $modal.open({
        templateUrl: 'views/modals/addUsernameModal.html',
        controller: 'AuthModalAngCtrl'
      });

      modalInstance.result.then(function(selectedItem) {
        vm.selected = selectedItem;
      }, function(user) {
        $timeout(function() {
          console.log('________________RESPONSE LOGIN____________');
          $localStorage.currentUser = user;
          $rootScope.currentUser = $localStorage.currentUser;
          var userToken = user.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          announces.postAnnounce({
            title: vm.announce.title,
            content: vm.announce.content,
            type: vm.announce.type,
            category: vm.announce.category,
            price: vm.announce.price,
            images: vm.announce.selectedImages,
            activated: true
          }).then(function(response) {
            console.log(response);
            vm.paginateUser(vm.page);
            vm.content = '';
            vm.title = '';
            vm.category = '';
            vm.type = '';
          });
        });
      });
    }
  }

  function remove(announce) {
    console.log('remove');
    console.log(announce);
    announces.deleteAnnounce(announce._id).then(function(err) {});
    for (var i in vm.announces) {
      if (vm.announces[i] == announce) {
        vm.announces.splice(i, 1);
      }
    }
  }

  function desactivate(id) {
    announces.putAnnounce({
      _id: id,
      activated: false
    }).then(function() {});

    toaster.pop('warning', 'Ce service est désactivé');
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    vm.noAnnounces = false;
    vm.findFromUser($rootScope.currentUser._id);
  }

  function activate(id) {
    announces.putAnnounce({
      _id: id,
      activated: true
    }).then(function() {});

    toaster.pop('success', 'Ce service est activé');
    vm.findFromUser($rootScope.currentUser._id);
  }

  function findFromUser(userId) {
    announces.getAnnouncesFromUser(userId).then(function(announces) {
      console.log('___FROM USER____');
      console.log(announces);
      vm.announces = announces;
      allAnnounces = announces;
    });
  }

  function initListCreateAnnounce() {
    console.log('initListCreateAnnounce');
    vm.paginateUser(vm.page);
  }
}
