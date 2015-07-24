angular.module('InTouch')
.controller('CreateAnnounceAngCtrl', CreateAnnounceAngCtrl);

CreateAnnounceAngCtrl.$inject = ['$injector', '$timeout', '$localStorage', '$scope', '$http', '$rootScope', '$modal'];

function CreateAnnounceAngCtrl($injector, $timeout, $localStorage, $scope,
  $http, $rootScope, $modal) {

  console.log('*************AnnounceCtrl************************');

  var vm                    = this;

  // Requirements
  var Actuality             = $injector.get('Actuality');
  var Announce              = $injector.get('Announce');
  var toaster               = $injector.get('toaster');
  var appLoading            = $injector.get('appLoading');

  vm.paginateUser           = paginateUser;
  vm.listUsers              = listUsers;
  vm.create                 = create;
  vm.remove                 = remove;
  vm.desactivate            = desactivate;
  vm.activate               = activate;
  vm.initListCreateAnnounce = initListCreateAnnounce;
  vm.pageChanged            = pageChanged;

  appLoading.ready();
  $localStorage.searchField = null;

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  vm.tags    = [];
  vm.page    = 1;
  vm.total   = 0;
  vm.maxSize = 10;

  ////////////////////////////////////////////////////////////////////////

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.page = currentPage;
    vm.paginateUser(vm.page);
  }

  vm.options = [
    'Appareils',
    'Meubles',
    'Vêtements',
    'Echanges de savoirs',
    'Informatique',
    'Musique',
    'Cours de langue',
    'Photographie',
    'Production vidéo',
    'Transport',
    'Garde d\'enfants',
    'Ménage',
    'Bricolage',
    'Peinture',
    'Jardinage',
    'Expertise comptable',
    'Préparation de plats cuisiniers',
    'Aide pour la mise en place d\'un festin',
    'Soins médicaux',
    'Encadrement des activités sportives',
    'coupe de cheveux',
    'Manucure'
  ];

  vm.tags = [];

  function paginateUser(page) {
    console.log('paginate user announces');
    vm.page = page;
    if ($rootScope.currentUser) {

      Announce.getAnnouncesFromUser({
        page : vm.page,
        limit : vm.maxSize,
        user: $rootScope.currentUser._id
      }).then(function(data) {
        console.log('_________paginate user____________________');

        vm.announces   = data.announces;
        console.log(vm.announces);
        for (var i = 0; i < vm.announces.length; i++) {
          if (vm.announces[i].title.length > 18) {
            vm.announces[i].title = vm.announces[i].title.substring(0, 19) + '...';
          }
        }
        console.log(data.total);
        vm.total       = data.total;
      });
    }
  }

  function listUsers() {
    vm.paginate(vm.page);
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
        tags: vm.tags
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
    swal({
      title: 'Etes-vous sur?',
      text: 'Vous allez devoir recréer une nouvelle annonce!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Oui',
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm) {
      if (isConfirm) {
        Announce.deleteAnnounce(announce._id).then(function(err) {});
        for (var i in vm.announces) {
          if (vm.announces[i] == announce) {
            vm.announces.splice(i, 1);
          }
        }
        swal('Effacé!', 'Votre annonce a été effacée.', 'success');
      } else {
        swal('Annulé', 'Votre annonce n\'a pas été effacée', 'error');
      }
    });

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
