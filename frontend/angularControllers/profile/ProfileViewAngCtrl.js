angular.module('InTouch')
  .controller('ProfileViewAngCtrl', ProfileViewAngCtrl);

ProfileViewAngCtrl.$inject = ['$localStorage', '$routeParams', 'Image', '$rootScope', '$location', 'appLoading'];

function ProfileViewAngCtrl($localStorage, $routeParams, Image, $rootScope, $location, appLoading) {
  appLoading.ready();

  var vm           = this;

  $localStorage.searchField = null;

  Images.getImagesById($routeParams.userId).then(function(response) {
    console.log(response);
    vm.profileImages = response;
  });
}
