angular.module('InTouch')
  .controller('AuthModalAngCtrl', ['Username', '$scope', '$modalInstance',
      function(Username, $scope, $modalInstance) {

        $scope.saveUser = function() {
          console.log('save user');
          console.log(this.username);
          Username.postUsername({username: this.username}).then(function(response) {
            console.log('username success');
          });
          $modalInstance.dismiss('cancel');
        };


        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };






      }
]);
