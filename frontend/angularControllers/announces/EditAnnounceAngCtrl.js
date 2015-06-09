angular.module('InTouch')
.controller('EditAnnounceAngCtrl', EditAnnounceAngCtrl);

EditAnnounceAngCtrl.$inject = ['$location', '$routeParams', 'announces', '$rootScope', '$http', 'appLoading'];

function EditAnnounceAngCtrl($location, $routeParams, announces, $rootScope, $http, appLoading) {

  var vm = this;

  console.log('*************AnnounceCtrl************************');

  vm.findOne = findOne;
  vm.update = update;

  appLoading.ready();

  if ($rootScope.currentUser) {
    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }

  function findOne() {
    announces.getAnnounceById($routeParams.announceId).then(function(res) {
      console.log('announce found________');
      console.log(res);
      vm.announce = res;
      vm.announceRating = res.rating;
      vm.selectedImages = res.images;
    });
  }

  function update() {
    var vm = this;
    console.log('____________________update_____________________');
    announces.putAnnounce({
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
