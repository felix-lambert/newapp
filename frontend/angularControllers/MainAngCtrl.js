angular.module('InTouch')
    .controller('MainAngCtrl', ['Username', '$http', 'toaster', 'friends', '$rootScope', 
      '$scope', 'Auth', '$location', '$modal', '$localStorage',
      function(Username, $http, notifications, toaster,
          friends, $rootScope, socket, $scope,
          Auth, $location, $modal, $localStorage) {

        console.log('*****mainctrl******');

        if ($rootScope.currentUser) {
          var userToken = $rootScope.currentUser.token;
          console.log($rootScope.currentUser.token);
          $http.defaults.headers.common['auth-token'] = userToken;
        }

        console.log('test rootScope.currentUser');
        if ($rootScope.currentUser) {
          Username.getUsernames({username: $rootScope.currentUser.username}).then(function(user) {
            console.log('username success');
          });
        }
        console.log('///////////////////////////////////////////////////');

        $scope.setUsername = function(suggestedUsername) {
          $scope.username = suggestedUsername;
        };

        $scope.joinServer = function() {
          $scope.user.name = this.username;
          if ($scope.user.name.length === 0) {
            $scope.error.join = 'Entrez un pseudo s\'il vous plaît';
          } else {
            var usernameExists = false;
            Username.postUsername({username: this.username}).then(function(user) {
              console.log('username success');
              console.log('________________RESPONSE LOGIN____________');
              $localStorage.currentUser = user;
              $rootScope.currentUser = $localStorage.currentUser;
              notifications.getNotifications().then(function(response) {
                console.log(response);
                console.log(response.length);
                $rootScope.currentUser.notifications = response;
                $rootScope.currentUser.i = response.length;
              });
            });
          }
        };
      }
]);
