angular.module('InTouch')
  .controller('SendMessageAngCtrl', SendMessageAngCtrl);

SendMessageAngCtrl.$inject = ['$routeParams', '$injector', '$scope', '$location',
'$rootScope'];

function SendMessageAngCtrl($routeParams, $injector, $scope, $location, $rootScope) {

  console.log('*****mainctrl******');

  var vm         = this;
  
  // Requirements
  var appLoading = $injector.get('appLoading');
  var Users      = $injector.get('Users');

  appLoading.ready();
  console.log($routeParams.userId);

  $localStorage.searchField = null;

  Users.getUserById($routeParams.userId).then(function(response) {
    console.log('response...');
    console.log(response);
    vm.name = response;
  });

}
