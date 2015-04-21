angular.module('InTouch')
    .controller('MainHeaderAngCtrl', ['notifications', 'socket', '$modal', '$http', '$scope',
      '$rootScope', 'Auth', '$location',
      function(notifications, socket, $modal, $http, $scope, $rootScope,
            Auth, $location) {

        console.log('************ Main HEADER CTRL **********');

        if ($rootScope.currentUser) {
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
        }
        
        var reset = null;
        $scope.notifications = [];

        socket.on('receiveFriendRequest', function(user) {
          console.log('__   receive fiend request__________');
          console.log(user);
          if ($rootScope.currentUser) {
            var userToken = $rootScope.currentUser.token;
            $http.defaults.headers.common['auth-token'] = userToken;
          }

          notifications.postNotification({
            userDes: user.userDes,
            user: user.user,
            userId: user.id,
            userDesId: user.userDesId
          }).then(function(response) {
            console.log('notifications success');
          });
          if ($rootScope.currentUser) {
            notifications.getNotifications().then(function(response) {
              $scope.currentUser.notifications = response;
              console.log('________________RESPONSE____________');
              console.log(response);
              $rootScope.currentUser.i = response.length;
            });
          }
          if ($rootScope.currentUser &&
            $rootScope.currentUser.username === user.userDes) {
            console.log('toaster');
            toaster.pop('success', 'Vous avez reçu une requête d\'amitié');
            console.log('define currentUser ! ');
          }
        });

        socket.on('receiveAcceptFriendRequest', function(user) {
          console.log('_________receive friend request___________');
          console.log(user);
          if ($rootScope.currentUser.username === user.userRec) {
            toaster.pop('success', user.userDes + ' a accepté votre ' +
              'requête d\'amitié');
            console.log('define currentUser ! ');
          }
        });

        $scope.refuseFriendRequest = function(user) {
          console.log('_____refuse friends request_____________________');
          console.log(user);

          console.log($rootScope.currentUser._id);
          /*
          var friend = new friends({
              idUser: user.userId,
              refuse: 'refuse'
          });
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          console.log('save');
          friend.$save();

          var notification = new notifications({
            userToDelete: user.id,
          });
          notification.$update(function(res) {
            console.log('remove');
          });
          */
          /*
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          notifications.query(function(response) {
            console.log('________________RESPONSE____________');
            console.log(response);
            $scope.currentUser.notifications = response;
            $rootScope.currentUser.i = response.length;
          });
          */
          toaster.pop('warning', 'Je compte réorganiser l\'implémentation du refuse friendRequest');
        };

        $scope.acceptFriendRequest = function(user) {
          console.log('_____accept friends request_____________________');
          console.log(user);
          console.log($rootScope.currentUser._id);

          notifications.updateNotification({
            userToDelete: user.id,
          }).then(function(res) {
            console.log('remove');
          });

          socket.emit('sendAcceptFriendRequest', {
            userRec: user.userRec,
            userDes: user.userDes,
            userDesId: user.userId,
            id: $rootScope.currentUser._id
          });
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          friends.postFriend({
              usernameAcceptedFriendRequest: user.userRec,
              idUser: user.userId,
          }).then(function(response) {
            console.log('friend posted');
          });
          notifications.getNotifications().then(function(response) {
            console.log('________________RESPONSE____________');
            console.log(response);
            $scope.currentUser.notifications = response;
            $rootScope.currentUser.i = response.length;
          });
          toaster.pop('success', 'Vous êtes désormais ami avec : ' +
            user.userRec);
        };

        if ($rootScope.currentUser) {
          notifications.getNotifications(function(response) {
            console.log('________________RESPONSE____________');
            console.log(response);
            $scope.currentUser.notifications = response;
            $rootScope.currentUser.i = response.length;
          });
        }
        $scope.open = function(size) {
          var modalInstance = $modal.open({
              templateUrl: 'views/modals/aboutModal.html',
              controller: 'AboutModalAngCtrl',
              size: size
          });

          modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
          }, function() {
            console.log('Modal dismissed at: ' + new Date());
          });
        };

        $scope.switch = function(page) {
          $scope.page = page;
        };

        $scope.about = function() {
          var modalInstance = $modal.open({
            templateUrl: 'aboutModal',
            controller: aboutModalCtrl
          });
        };

        var aboutModalCtrl = function($scope, $modalInstance) {
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
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

        $scope.register = function(form) {
          console.log('**************register*********************');
          Auth.createUser({
            email: $scope.user.email,
            username: $scope.user.username,
            password: $scope.user.password,
            confPassword: $scope.user.passwordConfirmation
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

        $scope.logout = function() {
          Auth.logout(function(err) {
            if (!err) {
              $location.path('/');
            }
          });
        };
      }
]);
