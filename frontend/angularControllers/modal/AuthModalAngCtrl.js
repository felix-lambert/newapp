angular.module('InTouch')
  .controller('AuthModalAngCtrl', AuthModalAngCtrl);

AuthModalAngCtrl.$inject = ['$injector', '$modalInstance'];

function AuthModalAngCtrl($injector, $modalInstance) {

  var vm       = this;

  var Username = $injector.get('Username');

  vm.saveUser  = saveUser;
  vm.cancel    = cancel;

  ////////////////////////////////////////////////////////////////////////////

  function saveUser() {
    console.log('save user');
    console.log(vm.username);
    Username.postUsername({username: vm.username}).then(function(response) {
      console.log('username success');
      $modalInstance.dismiss(response);
    });
  }

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
