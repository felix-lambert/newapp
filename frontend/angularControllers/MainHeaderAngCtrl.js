angular.module('InTouch')
  .controller('MainHeaderAngCtrl', MainHeaderAngCtrl);

function arrayIndexOf(myArray, searchTerm) {
  console.log(myArray);
  console.log(searchTerm);
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm) {
      return i;
    }
  }
  return -1;
}

MainHeaderAngCtrl.$inject = ['$scope', '$injector', '$localStorage', '$window',
'$route', '$modal', '$http', '$rootScope', '$location'];

function MainHeaderAngCtrl($scope, $injector, $localStorage, $window, $route,
  $modal, $http, $rootScope, $location) {

  console.log('************ Main HEADER CTRL **********');
  var vm                 = this;

  // Requirements
  var Auth               = $injector.get('Auth');
  var appLoading         = $injector.get('appLoading');
  var Messages           = $injector.get('Messages');
  var Friends            = $injector.get('Friends');
  var toaster            = $injector.get('toaster');
  var socket             = $injector.get('socket');
  var Notifications      = $injector.get('Notifications');
  var Announce           = $injector.get('Announce');

  vm.search              = search;
  vm.see                 = see;
  vm.follow              = follow;
  vm.refuseFriendRequest = refuseFriendRequest;
  vm.acceptFriendRequest = acceptFriendRequest;
  vm.open                = open;
  vm.about               = about;
  vm.logout              = logout;
  vm.messageSend         = messageSend;
  vm.Login               = Login;

  vm.suggestions         = [];
  vm.usernames           = [];
  vm.messages            = [];

  vm.findOptionsList = [{
    name: 'Annonces'
  }, {
    name: 'Utilisateurs'
  }];

  vm.name = 'Annonces';

  //////////////////////////////////////////////////////////////////////////
  var announce = new Announce();

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
        console.log('appLoading ready');
        swal('Authentification réussie!', '', 'success');
        appLoading.ready();
        $location.path('/');
      } else {
        appLoading.ready();
        swal(err.err, 'Try again', 'warning');
      }
    });
  }

  vm.setSelectedClient = function(name) {
    console.log('setSelected');
    vm.name = name;
    console.log(name);
    vm.searchText = '';
  };

  vm.see = function() {
    console.log('see');
    vm.announceSuggestions = [];
    $rootScope.page = false;
  };

  function messageSend(id) {
    vm.suggestions = [];
    $rootScope.page = false;
    return $location.path('/message/' + id);
  }

  if ($rootScope.currentUser) {
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    Messages.getMessagesFromUser($rootScope.currentUser.username)
    .then(function(response) {
      vm.nbMessages = response.length;
      for (var i = 0; i < response.length; i++) {
        vm.messages.push({
          message: response[i].content,
          name: response[i].user
        });
      }
    });
    Notifications.getNotifications().then(function(response) {
      $rootScope.currentUser.notifications = response;
      $rootScope.currentUser.notificationsCount = response.length;
    });

    socket.on('sendChatMessage', function(message) {
      console.log('_______________ send in header_____________________');
      toaster.pop('success', 'Un nouveau message a été envoyé');
      Messages.getMessagesFromUser($rootScope.currentUser.username)
      .then(function(response) {
        vm.nbMessages = response.length;
        for (var i = 0; i < response.length; i++) {
          vm.messages.push({
            message: response[i].content,
            name: response[i].user
          });
        }
      });
    });

  }

  var reset = null;
  vm.notifications = [];
  socket.on('receiveFriendRequest', function(user) {
    console.log('______receive fiend request__________');
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    if ($rootScope.currentUser) {
      Notifications.getNotifications().then(function(response) {
        $rootScope.currentUser.notifications = response;
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

  socket.on('receiveLike', function(user) {
    console.log('______receive fiend request__________');
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }

    if ($rootScope.currentUser) {
      Notifications.getNotifications().then(function(response) {
        $rootScope.currentUser.notifications = response;
        console.log('________________RESPONSE____________');
        console.log(response);
        $rootScope.currentUser.notificationsCount = response.length;
      });
    }
    if ($rootScope.currentUser &&
      $rootScope.currentUser.username === user.userDes) {
      console.log('toaster');
      toaster.pop('success', 'Vous avez reçu un like');
    }
  });

  socket.on('receiveAcceptFriendRequest', function(user) {
    console.log('_________receive friend request___________');
    if ($rootScope.currentUser.username === user.userRec) {

      Notifications.getNotifications().then(function(response) {
        $rootScope.currentUser.notifications = response;
        console.log('________________RESPONSE____________');
        console.log(response);
        $rootScope.currentUser.notificationsCount = response.length;
      });
      toaster.pop('success', user.userDes + ' a accepté votre ' +
        'requête d\'amitié');
      console.log('define currentUser ! ');
    }
  });

  function search() {
    console.log('rechercher');
    console.log(vm.searchText);
    appLoading.loading();
    if (!vm.searchText) {
      console.log('good');
      $rootScope.page = false;
    } else {
      console.log('bad');
      $rootScope.page = true;
    }
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    if (vm.name === 'Utilisateurs') {
      $http.get('/search/' + '?term=' + vm.searchText)
        .success(function(data) {
          if (data.length > 0) {
            $rootScope.page = true;
          } else {
            $rootScope.page = false;
          }

          console.log(data);
          if ($rootScope.currentUser) {
            console.log('inside currentuser');
            Friends.getFriendsFromUser()
            .then(function(usernames) {
              console.log(usernames);
              for (var i = 0; i < usernames.length; i++) {
                vm.usernames[i] = usernames[i].accepted ?
                usernames[i].accepted : usernames[i].wait;
                console.log(vm.usernames[i]);
              }
              console.log(usernames);
              
              console.log('test data follow');
              for (var j = 0; j < data.length; j++) {
                data[j].username = arrayIndexOf(vm.usernames, data[j]._source.username) < 0 ?
                {
                  'follow': data[j]._source.username,
                  'friendId': data[j]._id,
                } : {
                  'notFollow': data[j]._source.username
                };
                if (data[j].username.notFollow) {
                  for (var k = 0; k < usernames.length; k++) {
                    if (data[j].username.notFollow === usernames[k].wait) {
                      console.log('wait result');
                      data[j].username.notFollow = {'wait' : usernames[k].wait};
                    } else if (data[j].username.notFollow === usernames[k].accepted) {
                      console.log('accepted result');
                      data[j].username.notFollow = {'accept' : usernames[k].accepted};
                    }
                  }
                }
              }

              console.log('put data in suggestions');
              console.log(data);
              vm.suggestions = data;
              console.log('usernames');
              console.log(usernames);

              vm.usernameStatuses   = usernames;
              appLoading.ready();
            });
          } else {
            console.log('_______tester le data___');
            console.log(data);
            for (var j = 0; j < data.length; j++) {
              data[j] = {
                  'noAuth': data[j]._source.username,
                  'profileImage': data[j]._source.profileImage,
                  'userId': data[j]._id
              };
            }
            console.log(vm.suggestions);
            console.log(data);
            vm.suggestions = data;
            appLoading.ready();
          }
        });
    } else {
      console.log('recherche d\'annonces');
      announce.setSearch(vm.searchText, vm.page);
      announce.searchAnnounces().then(function() {
        console.log(announce._announces);
        vm.announceSuggestions = announce._announces;
      });
      appLoading.ready();
    }
  }

  function see() {
    vm.suggestions = '';
  }

  function follow(userDes, userId) {
    console.log('_____follow_____');
    console.log(userDes);
    console.log(userId);
    vm.suggestions = '';
    Friends.postFriend({
      usernameWaitFriendRequest: userDes,
      idUser: userId
    }).then(function(response) {
      console.log('friend request done');
      Notifications.postNotification({
        userDes: userDes,
        user: $rootScope.currentUser.username,
        userDesId: userId,
        type: 'friendRequest'
    }).then(function(response) {
      console.log('notifications success');
      console.log('toaster');
      toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
      socket.emit('sendFriendRequest', {
        user: $rootScope.currentUser.username,
        userDes: userDes[0],
        userDesId: userDes[1],
        id: $rootScope.currentUser._id
      });
    });

    });

    
  }

  function refuseFriendRequest(user) {
    console.log('_____refuse friends request_____________________');
    console.log(user.userDes);
    console.log($rootScope.currentUser._id);
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    if (user.type === 'friendRequest') {
      Friends.deleteFriend(user.userId, user.userDes).then(function(response) {
        console.log('delete friend request done');
      });
      toaster.pop('warning', 'Vous avez refusé la demande d\'amitié de ' + user.userRec);
    }

    Notifications.updateNotification({
      userToDelete: user.id
    }).then(function(response) {
      console.log('remove');
    });

    Notifications.getNotifications().then(function(response) {
      $rootScope.currentUser.notifications      = response;
      $rootScope.currentUser.notificationsCount = response.length;
    });

  }

  function acceptFriendRequest(notification) {
    console.log('_____accept friends request_____________________');
    console.log(notification);

    Notifications.updateNotification(
      notification.id
    ).then(function(res) {
      console.log('remove');
      Notifications.postNotification({
        userDes: notification.userDes,
        user: notification.userRec,
        userDesId: notification.userDesId,
        type: 'accept'
      }).then(function(response) {
        console.log('notifications success');
        socket.emit('sendAcceptFriendRequest', {
          userRec: notification.userRec,
          userDes: notification.userDes,
          userDesId: notification.userId,
          id: $rootScope.currentUser._id
        });
        var userToken                               = $rootScope.currentUser.token;
        $http.defaults.headers.common['auth-token'] = userToken;
        Friends.postFriend({
            usernameAcceptedFriendRequest: notification.userRec,
            idUser: notification.userId,
        }).then(function(response) {
          console.log('friend posted');
          Notifications.getNotifications().then(function(response) {
            console.log('________________RESPONSE____________');
            console.log(response);
            $rootScope.currentUser.notifications      = response;
            $rootScope.currentUser.notificationsCount = response.length;
            toaster.pop('success', 'Vous êtes désormais ami avec : ' +
            notification.userRec);
          });
        });
      });
    });

    
  }

  function open(size) {
    var modalInstance = $modal.open({
        templateUrl: 'views/modals/aboutModal.html',
        controller: 'AboutModalAngCtrl',
        size: size
    });

    modalInstance.result.then(function(selectedItem) {
      vm.selected = selectedItem;
    }, function() {
      console.log('Modal dismissed at: ' + new Date());
    });
  }

  function about() {
    var modalInstance = $modal.open({
      templateUrl: 'aboutModal',
      controller: aboutModalCtrl
    });
  }

  var aboutModalCtrl = function(vm, $modalInstance) {
    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };

  function logout() {
    console.log('logout');
    $http.delete('/auth/logout/').success(function(data) {
        console.log(data);
        if (data) {
          console.log('test logout');
          $localStorage.searchField = null;
          $localStorage.currentUser = null;
          $rootScope.currentUser    = null;
        }
    });
    console.log('logout');
  }
}
