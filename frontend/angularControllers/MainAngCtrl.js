angular.module('InTouch')
  .controller('MainAngCtrl', MainAngCtrl);

MainAngCtrl.$inject = ['$scope', 'Auth', '$location',
'$rootScope', 'appLoading'];

function MainAngCtrl($scope, Auth, $location, $rootScope, appLoading) {

  console.log('*****mainctrl******');
  
  var vm      = this;
  
  vm.Login    = Login;
  vm.register = register;

  appLoading.ready();

  //////////////////////////////////////////////////////////////////////////

  function Login() {
    console.log('_______________LOG IN____________');
    appLoading.loading();
    var vm = this;
    console.log(vm);
    Auth.login({
      'email': vm.emailLog,
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
    vm.dataLoading = true;
    console.log(this);
    Auth.createUser({
      email: this.email,
      username: this.username,
      password: this.password,
      confPassword: this.passwordConfirmation
    },
    function(err) {
      vm.errors = {};
      if (!err) {
        $rootScope.currentUser.notificationsCount = 0;
        $location.path('/');
      }
    });
  }
}
