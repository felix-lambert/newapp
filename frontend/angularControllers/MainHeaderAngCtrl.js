angular.module('InTouch')
    .controller('MainHeaderAngCtrl', ['$attrs', 'friends', 'toaster', '$timeout', '$localStorage', '$window', '$route', 'notifications', 'socket', '$modal', 
      '$http', '$scope', '$rootScope', 'Auth', '$location', '$element', '$filter',
      function($attrs, friends, toaster, $timeout, $localStorage, $window, $route, notifications, socket, $modal, $http, $scope, $rootScope,
            Auth, $location, $element, $filter) {

        console.log('************ Main HEADER CTRL **********');
        $scope.suggestions = [];
        $scope.usernames = [];

        if ($rootScope.currentUser) {
          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          console.log($scope.currentUser.notifications);
        }

        var reset = null;
        $scope.notifications = [];

        socket.on('receiveFriendRequest', function(user) {
          console.log('______receive fiend request__________');
          if ($rootScope.currentUser) {
            var userToken = $rootScope.currentUser.token;
            $http.defaults.headers.common['auth-token'] = userToken;
          }

          notifications.postNotification({
            userDes: user.userDes,
            user: user.user,
            userId: user.id,
            userDesId: user.userDesId,
            type: 'friendRequest'
          }).then(function(response) {
            console.log('notifications success');
          });
          if ($rootScope.currentUser) {
            notifications.getNotifications().then(function(response) {
              $scope.currentUser.notifications = response;
              console.log('________________RESPONSE____________');
              console.log(response);
              $rootScope.currentUser.notificationsCount = response.length;
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
            notifications.postNotification({
              userDes: user.userDes,
              user: user.userRec,
              userId: user.id,
              userDesId: user.userDesId,
              type: 'accept'
            }).then(function(response) {
              console.log('notifications success');
            });
            notifications.getNotifications().then(function(response) {
              $scope.currentUser.notifications = response;
              console.log('________________RESPONSE____________');
              console.log(response);
              $rootScope.currentUser.notificationsCount = response.length;
            });
            toaster.pop('success', user.userDes + ' a accepté votre ' +
              'requête d\'amitié');
            console.log('define currentUser ! ');
          }
        });

        $scope.search = function() {
          console.log('rechercher');
          console.log($scope.searchText);
          if ($rootScope.currentUser) {
            var userToken = $rootScope.currentUser.token;
            $http.defaults.headers.common['auth-token'] = userToken;
          }
          $http.get('/search/' + '?term=' + $scope.searchText)
            .success(function(data) {
              if ($rootScope.currentUser) {
                $rootScope.currentUser = $rootScope.currentUser;
                $scope.currentUser = $rootScope.currentUser;
                friends.getFriendsFromUser($rootScope.currentUser._id)
                .then(function(usernames) {
                  for ($scope.i = 0; $scope.i < usernames.length; $scope.i++) {
                    if (usernames[$scope.i].wait !== undefined) {
                      $scope.usernames[$scope.i] = usernames[$scope.i].wait;
                    } else if (usernames[$scope.i].accepted !== undefined) {
                      $scope.usernames[$scope.i] = usernames[$scope.i].accepted;
                    }
                  }
                  for ($scope.j = 0; $scope.j < data.length; $scope.j++) {
                    var search = data[$scope.j];
                    var indexOfArray = arrayIndexOf($scope.usernames, search);
                    if (indexOfArray < 0) {
                      data[$scope.j] = {
                          'follow': data[$scope.j]
                      };
                    } else {
                      data[$scope.j] = {
                          'notFollow': data[$scope.j]
                      };
                    }
                  }
                  $scope.suggestions = data;
                  $scope.usernames = usernames;
                });
              } else {
                for ($scope.j = 0; $scope.j < data.length; $scope.j++) {
                  var search = data[$scope.j];
                  data[$scope.j] = {
                      'notFollow': data[$scope.j]
                  };
                }
                $scope.suggestions = data;
              }
            });
          };

        $scope.see = function() {
          $scope.suggestions = '';
        };

        $scope.follow = function(userDes) {
          console.log('_____follow_____');
          $scope.suggestions = '';
          friends.postFriend({
            usernameWaitFriendRequest: userDes[0],
            idUser: userDes[1]
          }).then(function(response) {
            console.log('friend request done');
          });
          console.log('toaster');
          toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
          socket.emit('sendFriendRequest', {
              user: $rootScope.currentUser.username,
              userDes: userDes[0],
              userDesId: userDes[1],
              id: $rootScope.currentUser._id
          });
        };

        function arrayIndexOf(myArray, searchTerm) {
          for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i] === searchTerm[0]) {
              return i;
            }
          }
          return -1;
        }

        $scope.refuseFriendRequest = function(user) {
          console.log('_____refuse friends request_____________________');
          console.log(user.userDes);

          console.log($rootScope.currentUser._id);

          var userToken = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          console.log('save');

          friends.deleteFriend(user.userId, user.userDes).then(function(response) {
            console.log('delete friend request done');
          });

          notifications.updateNotification({
            userToDelete: user.id
          }).then(function(response) {
            console.log('remove');
          });

          notifications.getNotifications().then(function(response) {
            $scope.currentUser.notifications = response;
            $rootScope.currentUser.notificationsCount = response.length;

          });
          toaster.pop('warning', 'Vous avez refusé la demande d\'amitié de ' + user.userRec);
        };

        $scope.acceptFriendRequest = function(user) {
          console.log('_____accept friends request_____________________');
          console.log(user);

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
            $rootScope.currentUser.notificationsCount = response.length;
          });
          toaster.pop('success', 'Vous êtes désormais ami avec : ' +
            user.userRec);
        };

        // if ($rootScope.currentUser) {
        //   notifications.getNotifications(function(response) {
        //     console.log('________________RESPONSE GET NOTIFICATION____________');
        //     console.log(response);
        //     $scope.currentUser.notifications = response;
        //     $rootScope.currentUser.i = response.length;
        //   });
        // }
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
          console.log(page);
          $rootScope.page = page;
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

        $scope.Login = function() {
          console.log('_______________LOG IN____________');
          Auth.login({
            'email': $scope.user.emailLog,
            'password': $scope.user.passwordLog
          }, function(err) {
            if (!err) {
              $location.path('/');
            }
          }
          );
        };

        $scope.logout = function() {
          var userToken = $rootScope.currentUser.token;
          console.log('logout');
          delete $localStorage.currentUser;
          delete $localStorage;
          delete $rootScope.currentUser;
          $window.location.href = '/auth/logout/' + userToken;
          console.log('logout');
        };
      }
]);
