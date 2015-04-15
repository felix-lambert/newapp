angular.module('InTouch')
    .controller('MainHeaderAngCtrl', ['socket', '$http', '$scope', '$rootScope',
      'Auth', '$location', '$window',
      function(socket, $http, $scope, $rootScope,
            Auth, $location, $window) {

        console.log('************ Main HEADER CTRL **********');

        if ($rootScope.currentUser) {
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
        }

        $scope.loginOauth = function(provider) {
          // $window.location.href = '/auth/' + provider;
        };

        $scope.Login = function(form) {
          Auth.login('password', {
                  'email': $scope.user.emailLog,
                  'password': $scope.user.passwordLog
              },
              function(err) {
                if (!err) {
                  $location.path('/');
                }
              }
            );
        };

        $scope.logout = function() {
          Auth.logout(function(err) {
            if (!err) {
              $location.path('/');
            }
          });
        };
      }
]);
