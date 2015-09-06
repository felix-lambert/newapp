angular.module('InTouch')
.controller('CreateAnnounceAngCtrl', CreateAnnounceAngCtrl);

CreateAnnounceAngCtrl.$inject = ['$injector', '$timeout', '$localStorage', '$http', '$rootScope', '$modal', 'preGetUserAnnounces'];

function CreateAnnounceAngCtrl($injector, $timeout, $localStorage, $http, $rootScope, $modal, preGetUserAnnounces) {

  console.log('****************AnnounceCtrl************************');

  var vm                    = this;
  
  // Requirements
  var Actuality             = $injector.get('Actuality');
  var Announce              = $injector.get('Announce');
  var toaster               = $injector.get('toaster');
  var appLoading            = $injector.get('appLoading');
  var AnnounceService       = $injector.get('AnnounceService');
  
  vm.paginateUser           = paginateUser;
  
  vm.create                 = create;
  vm.remove                 = remove;
  vm.desactivate            = desactivate;
  vm.activate               = activate;
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

  var announce = new Announce();
  var actuality = new Actuality();

  function pageChanged(currentPage) {
    console.log('Page changed to: ' + currentPage);
    vm.paginateUser(currentPage);
  }

  var userAnnounces = preGetUserAnnounces;

  vm.announces = userAnnounces.announces;
  vm.total = userAnnounces.total;

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

  function paginateUser(page) {
    console.log('paginate user announces');
    vm.page = page;
    if ($rootScope.currentUser) {
      announce.setAnnouncePagination(vm.page);

      announce.getAnnouncesFromUser().then(function() {
        vm.announces   = announce._announces;
        vm.total       = announce._total;
      });
    }
  }

  function create() {
    console.log('create');
    var vm = this;
    var announce = AnnounceService.create(vm.title, vm.content, vm.type, vm.category, vm.price, vm.selectedImages, true, vm.tags);
    announce.getAnnouncesFromUser().then(function () {
      vm.title      = '';
      vm.content    = '';
      vm.title      = '';
      vm.category   = '';
      vm.type       = '';
      vm.tags       = [];
      vm.announces  = announce._announces;
      vm.total      = announce._total;
      actuality.setActualityField({status: 1, content: vm.content});
      actuality.postActuality();
    });
  }

  function remove(ann) {
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
        announce.setId(ann._id);
        announce.deleteAnnounce().then(function() {
          console.log(vm.announces);
          console.log(announce._announces);
          for (var i in vm.announces) {
            if (vm.announces[i] == announce._announces[i]) {
              vm.announces.splice(i, 1);
            }
          }
          swal('Effacé!', 'Votre annonce a été effacée.', 'success');
        });
      } else {
        swal('Annulé', 'Votre annonce n\'a pas été effacée', 'error');
      }
    });

  }

  function desactivate(ann) {
    console.log('desactivate');
    announce.setStatusAnnounce(ann._id, false);
    announce.statusAnnounce().then(function() {
      toaster.pop('warning', 'Ce service est désactivé');
      vm.paginateUser(vm.page);
    });
  }

  function activate(ann) {
    announce.setStatusAnnounce(ann._id, true);
    announce.statusAnnounce().then(function() {
      toaster.pop('success', 'Ce service est activé');
      vm.paginateUser(vm.page);
    });
  }
}
