angular.module('InTouch')
.controller('EditAnnounceAngCtrl', EditAnnounceAngCtrl);

EditAnnounceAngCtrl.$inject = ['$injector', '$location', '$routeParams', '$rootScope', '$http'];

function EditAnnounceAngCtrl($injector, $location, $routeParams, $rootScope, $http) {

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

  function findOne() {
    Announce.getAnnounceById($routeParams.announceId).then(function(res) {
      console.log('announce found________');
      console.log(res);
      vm.announce       = res;
      vm.announceRating = res.rating;
      vm.selectedImages = res.images;
    });
  }

  function update() {
    var vm = this;
    console.log('____________________update_____________________');
    Announce.putAnnounce({
      _id: vm.announce._id,
      content: vm.announce.content,
      created: vm.announce.created,
      creator: vm.announce.creator,
      images: vm.selectedImages,
      price: vm.announce.price,
      status: vm.announce.status,
      title: vm.announce.title,
      updated: vm.announce.updated
    }).then(function(announce) {
      $location.path('/announces/' + announce._id);
    });
  }

}
