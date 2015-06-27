angular.module('InTouch')
.controller('CreateAnnounceAngCtrl', CreateAnnounceAngCtrl);

CreateAnnounceAngCtrl.$inject = ['Actuality', '$timeout', '$localStorage', '$scope', '$http', 'Announce',
'$rootScope', 'toaster', '$modal', 'appLoading'];

function CreateAnnounceAngCtrl(Actuality, $timeout, $localStorage, $scope,
  $http, Announce, $rootScope, toaster,
  $modal, appLoading) {

  console.log('*************AnnounceCtrl************************');

  var vm                    = this;
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
  vm.initListCreateAnnounce = initListCreateAnnounce;
  vm.pageChanged            = pageChanged;

  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  var allAnnounces  = [];
  vm.tags           = [];
  vm.page           = 1;
  vm.limit          = 5;
  vm.total          = 0;
  vm.pageNumbers    = [];
  vm.maxSize        = 5;
  vm.bigTotalItems  = 175;
  vm.bigCurrentPage = 1;


  ////////////////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.page = currentPage;
    vm.paginateUser(vm.page);
  }

  function decorateNumberPage(page, decoration, weight) {
    $('#bt' + page).css('text-decoration', decoration);
    $('#bt' + page).css('font-weight', weight);
  }

  function paginateUser(page) {
    console.log('paginate user announces');
    vm.page = page;
    if ($rootScope.currentUser) {
      Announce.getAnnouncesFromUser({
        page : vm.page,
        limit : vm.limit,
        user: $rootScope.currentUser._id
      }).then(function(data) {
        console.log('______________________________________');

        vm.announces   = data.announces;
        console.log(vm.announces);
        for (var i = 0; i < vm.announces.length; i++) {
          if (vm.announces[i].title.length > 9) {
            console.log(vm.announces[i].title.length);
            vm.announces[i].title = vm.announces[i].title.substring(0, 10) + '...';
          }
        }
        vm.total       = data.total;
        vm.pageNumbers = [];
        for (var j = 0; j < vm.total; j++) {
          vm.pageNumbers.push(j + 1);
        }
      });
      angular.forEach(vm.pageNumbers, function(page, key) {
        vm.decorateNumberPage(page, 'none', 'normal');
      });
      vm.decorateNumberPage(page, 'underline', 'bold');
    }
  }


  function listUsers() {
    vm.paginate(vm.page);
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
    vm.successMessage       = null;
    vm.errorMessage         = null;
    vm.nameErrorMessage     = null;
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
      Announce.postAnnounce({
        title: vm.title,
        content: vm.content,
        type: vm.type,
        category: vm.category,
        price: vm.price,
        images: vm.selectedImages,
        activated: true,
        tags: vm.data.tags
      }).then(function(response) {
        Actuality.postActuality({status: 1, content:vm.content}).then(function(res) {
          console.log(res);
        });
        console.log(response);
        vm.title    = '';
        vm.content  = '';
        vm.paginateUser(vm.page);
        vm.title    = '';
        vm.category = '';
        vm.type     = '';
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
          $localStorage.currentUser                   = user;
          $rootScope.currentUser                      = $localStorage.currentUser;
          var userToken                               = user.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          Announce.postAnnounce({
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
            vm.content  = '';
            vm.title    = '';
            vm.category = '';
            vm.type     = '';
          });
        });
      });
    }
  }

  function remove(announce) {
    console.log('remove');
    console.log(announce);
    Announce.deleteAnnounce(announce._id).then(function(err) {});
    for (var i in vm.announces) {
      if (vm.announces[i] == announce) {
        vm.announces.splice(i, 1);
      }
    }
  }

  function desactivate(announce) {
    console.log('desactivate');
    console.log(announce);
    Announce.statusAnnounce({
      _id: announce._id,
      activated: false
    }).then(function() {});

    toaster.pop('warning', 'Ce service est désactivé');
    vm.paginateUser(vm.page);
  }

  function activate(announce) {
    Announce.statusAnnounce({
      _id: announce._id,
      activated: true
    }).then(function() {});

    toaster.pop('success', 'Ce service est activé');
    vm.paginateUser(vm.page);
  }

  function initListCreateAnnounce() {
    console.log('initListCreateAnnounce');
    vm.paginateUser(vm.page);
  }
}
