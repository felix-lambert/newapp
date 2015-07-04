angular.module('InTouch')
  .controller('MainAngCtrl', MainAngCtrl);

MainAngCtrl.$inject = ['$injector', '$scope', '$location',
'$rootScope', 'appLoading'];

function MainAngCtrl($injector, $scope, $location, $rootScope) {

  console.log('*****mainctrl******');

  var vm         = this;

  // Requirements
  var Auth       = $injector.get('Auth');
  var appLoading = $injector.get('appLoading');

  vm.Login       = Login;
  vm.register    = register;

  appLoading.ready();

  //////////////////////////////////////////////////////////////////////////

  function Login() {
    console.log('_______________LOG IN____________');
    appLoading.loading();
    var vm = this;
    Auth.login({
      'email_username': vm.email_username,
      'password': vm.passwordLog
    }, function(err) {
      console.log(err);
      if (!err) {
        appLoading.ready();
        $location.path('/');
      } else {
        vm.error = err.err;
      }
    });
  }

  function register() {
    console.log('**************register*********************');
    console.log(this);
    var vm = this;
    vm.dataLoading = true;
    Auth.createUser({
      email: vm.email,
      username: vm.username,
      password: vm.password,
      confPassword: vm.passwordConfirmation
    },
    function(err) {
      vm.errors = {};
      if (!err) {
        console.log('works');
        $rootScope.currentUser.notificationsCount = 0;
        $location.path('/');
      }
    });
  }
}
