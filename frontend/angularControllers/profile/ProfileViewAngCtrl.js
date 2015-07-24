angular.module('InTouch')
  .controller('ProfileViewAngCtrl', ProfileViewAngCtrl);

ProfileViewAngCtrl.$inject = ['$routeParams', 'Images', '$rootScope', '$location', 'appLoading'];

function ProfileViewAngCtrl($routeParams, Images, $rootScope, $location, appLoading) {
  appLoading.ready();

  var vm           = this;

  $localStorage.searchField = null;

  Images.getImagesById($routeParams.userId).then(function(response) {
    console.log(response);
    vm.profileImages = response;
  });
}
