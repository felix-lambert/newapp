angular.module('InTouch')
.controller('EditAnnounceAngCtrl', EditAnnounceAngCtrl);

EditAnnounceAngCtrl.$inject = ['$localStorage', '$injector', '$location', '$routeParams', '$rootScope', '$http'];

function EditAnnounceAngCtrl($localStorage, $injector, $location, $routeParams, $rootScope, $http) {

  console.log('*************AnnounceCtrl************************');

  var vm         = this;

  // Requirements
  var Announce   = $injector.get('Announce');
  var appLoading = $injector.get('appLoading');

  vm.findOne     = findOne;
  vm.update      = update;

  appLoading.ready();

  $localStorage.searchField = null;

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  var announce = new Announce();

  function findOne() {
    announce.setId($routeParams.announceId);
    announce.getAnnounceById().then(function() {
      console.log('announce found________');
      vm.announce       = announce._announce;
      vm.announceRating = announce._announce.rating;
      vm.selectedImages = announce._announce.images;
    });
  }

  function update() {
    var vm = this;
    console.log('____________________update_____________________');
    announce.setAnnounceFieldForEdit(vm.announce._id, vm.announce.title, vm.announce.content, vm.announce.price);
    announce.putAnnounce().then(function() {
      $location.path('/announces/' + vm.announce._id);
    });
  }
}
