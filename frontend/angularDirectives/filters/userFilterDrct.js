angular.module('InTouch')
  .directive('autoComplete', ['toaster', '$http', '$rootScope', 'friends',
    'socket', function(toaster, $http, $rootScope, friends, socket) {
      return {
        restrict: 'AE',
        scope: {
            selectedTags: '=model'
        },
        templateUrl: 'views/templates/userFilterTemplate.html',
        link: function(scope, elem, attrs) {
          scope.suggestions = [];
          scope.usernames = [];
          if ($rootScope.currentUser) {
            var userToken = $rootScope.currentUser.token;
            $http.defaults.headers.common['auth-token'] = userToken;
          }

          scope.search = function() {
            if ($rootScope.currentUser) {
              var userToken = $rootScope.currentUser.token;
              $http.defaults.headers.common['auth-token'] = userToken;
            }
            $http.get(attrs.url + '?term=' + scope.searchText)
            .success(function(data) {
              console.log(data);
              if ($rootScope.currentUser) {
                $rootScope.currentUser = $rootScope.currentUser;
                scope.currentUser = $rootScope.currentUser;
                friends.getFriendsFromUser($rootScope.currentUser._id)
                .then(function(usernames) {
                  for (scope.i = 0; scope.i < usernames.length; scope.i++) {
                    if (usernames[scope.i].wait !== undefined) {
                      scope.usernames[scope.i] = usernames[scope.i].wait;
                    } else if (usernames[scope.i].accepted !== undefined) {
                      scope.usernames[scope.i] = usernames[scope.i].accepted;
                    }
                  }
                  for (scope.j = 0; scope.j < data.length; scope.j++) {
                    var search = data[scope.j];
                    var indexOfArray = arrayIndexOf(scope.usernames, search);
                    if (indexOfArray < 0) {
                      data[scope.j] = {
                          'follow': data[scope.j]
                      };
                    } else {
                      data[scope.j] = {
                          'notFollow': data[scope.j]
                      };
                    }
                  }
                  scope.suggestions = data;
                  scope.usernames = usernames;
                });
              } else {
                for (scope.j = 0; scope.j < data.length; scope.j++) {
                  var search = data[scope.j];
                  data[scope.j] = {
                      'notFollow': data[scope.j]
                  };
                }
                scope.suggestions = data;
              }
            });
          };

          scope.see = function() {
            scope.suggestions = '';
          };

          scope.follow = function(userDes) {
            console.log('_____follow_____');
            scope.suggestions = '';

            friends.postFriend({
              usernameWaitFriendRequest: userDes[0],
              idUser: userDes[1]
            }).then(function(response) {
              console.log('friend request done');
            });

            toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
            socket.emit('sendFriendRequest', {
                user: $rootScope.currentUser.username,
                userDes: userDes[0],
                userDesId: userDes[1],
                id: $rootScope.currentUser._id
            });
          };
        }
      };
    }]);

function arrayIndexOf(myArray, searchTerm) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm[0]) {
      return i;
    }
  }
  return -1;
}
