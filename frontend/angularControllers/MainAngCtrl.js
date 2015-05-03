angular.module('InTouch')
    .controller('MainAngCtrl', ['$scope', 'Auth', '$location', '$rootScope', 
      function($scope, Auth, $location, $rootScope) {

        console.log('*****mainctrl******');

        // if ($rootScope.currentUser) {
        //   var userToken = $rootScope.currentUser.token;
        //   console.log($rootScope.currentUser.token);
        //   $http.defaults.headers.common['auth-token'] = userToken;
        // }

        $scope.Login = function() {
          console.log('_______________LOG IN____________');
          Auth.login({
            'email': this.emailLog,
            'password': this.passwordLog
          }, function(err) {
            console.log(err);
            if (!err) {
              $location.path('/');
            } else {
              $scope.error = err.err;
            }
          });
        };

        $scope.register = function() {
          console.log('**************register*********************');
          console.log(this);
          Auth.createUser({
            email: this.email,
            username: this.username,
            password: this.password,
            confPassword: this.passwordConfirmation
          },
          function(err) {
            $scope.errors = {};
            console.log('____________________________________________');

            if (!err) {
              $rootScope.currentUser.i = 0;
              $location.path('/');
            }
          });
        };

        // console.log('test rootScope.currentUser');
        // if ($rootScope.currentUser) {
        //   Username.getUsernames({username: $rootScope.currentUser.username}).then(function(user) {
        //     console.log('username success');
        //   });
        // }
        // console.log('///////////////////////////////////////////////////');

        // $scope.setUsername = function(suggestedUsername) {
        //   $scope.username = suggestedUsername;
        // };

        // $scope.joinServer = function() {
        //   $scope.user.name = this.username;
        //   if ($scope.user.name.length === 0) {
        //     $scope.error.join = 'Entrez un pseudo s\'il vous plaît';
        //   } else {
        //     var usernameExists = false;
        //     Username.postUsername({username: this.username}).then(function(user) {
        //       console.log('username success');
        //       console.log('________________RESPONSE LOGIN____________');
        //       $localStorage.currentUser = user;
        //       $rootScope.currentUser = $localStorage.currentUser;
        //       notifications.getNotifications().then(function(response) {
        //         console.log(response);
        //         console.log(response.length);
        //         $rootScope.currentUser.notifications = response;
        //         $rootScope.currentUser.i = response.length;
        //       });
        //     });
        //   }
        // };
      }
]);


