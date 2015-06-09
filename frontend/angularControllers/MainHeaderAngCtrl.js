angular.module('InTouch')
  .controller('MainHeaderAngCtrl', MainHeaderAngCtrl);

MainHeaderAngCtrl.$inject = ['Messages', 'Friends', 'toaster', '$localStorage', '$window', '$route', 'Notifications', 'socket', '$modal', 
      '$http', '$rootScope', 'Auth', '$location', 'appLoading'];

function arrayIndexOf(myArray, searchTerm) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm[0]) {
      return i;
    }
  }
  return -1;
}

function MainHeaderAngCtrl(Messages, Friends, toaster, $localStorage, $window, $route, Notifications, socket, $modal, $http, $rootScope,
      Auth, $location, appLoading) {

  console.log('************ Main HEADER CTRL **********');
  
  var vm                 = this;
  
  vm.search              = search;
  vm.see                 = see;
  vm.follow              = follow;
  vm.refuseFriendRequest = refuseFriendRequest;
  vm.acceptFriendRequest = acceptFriendRequest;
  vm.open                = open;
  vm.changePage          = changePage;
  vm.about               = about;
  vm.logout              = logout;
  
  vm.suggestions         = [];
  vm.usernames           = [];
  vm.messages            = [];

  if ($rootScope.currentUser) {
    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  if ($rootScope.currentUser) {
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

    socket.on('sendChatMessage', function(message) {
      console.log('_______________ send in header_____________________');
      toaster.pop('success', 'Un nouveau message a été envoyé');
      Messages.getMessagesFromUser($rootScope.currentUser.username).then(function(response) {
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
      var userToken = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }

    Notifications.postNotification({
      userDes: user.userDes,
      user: user.user,
      userId: user.id,
      userDesId: user.userDesId,
      type: 'friendRequest'
    }).then(function(response) {
      console.log('notifications success');
    });

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

  socket.on('receiveAcceptFriendRequest', function(user) {
    console.log('_________receive friend request___________');
    console.log(user);
    if ($rootScope.currentUser.username === user.userRec) {
      Notifications.postNotification({
        userDes: user.userDes,
        user: user.userRec,
        userId: user.id,
        userDesId: user.userDesId,
        type: 'accept'
      }).then(function(response) {
        console.log('notifications success');
      });
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
    appLoading.loading();
    if ($rootScope.currentUser) {
      var userToken = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    $http.get('/search/' + '?term=' + vm.searchText)
      .success(function(data) {
        if ($rootScope.currentUser) {
          $rootScope.currentUser = $rootScope.currentUser;
          $rootScope.currentUser = $rootScope.currentUser;
          Friends.getFriendsFromUser($rootScope.currentUser._id)
          .then(function(usernames) {
            for (vm.i = 0; vm.i < usernames.length; vm.i++) {
              if (usernames[vm.i].wait !== undefined) {
                vm.usernames[vm.i] = usernames[vm.i].wait;
              } else if (usernames[vm.i].accepted !== undefined) {
                vm.usernames[vm.i] = usernames[vm.i].accepted;
              }
            }
            for (vm.j = 0; vm.j < data.length; vm.j++) {
              var search = data[vm.j];
              var indexOfArray = arrayIndexOf(vm.usernames, search);
              if (indexOfArray < 0) {
                data[vm.j] = {
                    'follow': data[vm.j]
                };
              } else {
                data[vm.j] = {
                    'notFollow': data[vm.j]
                };
              }
            }
            vm.suggestions = data;
            vm.usernames = usernames;
          });
        } else {
          for (vm.j = 0; vm.j < data.length; vm.j++) {
            var search = data[vm.j];
            data[vm.j] = {
                'notFollow': data[vm.j]
            };
          }
          vm.suggestions = data;
        }
        appLoading.ready();
      });
  }

  function see() {
    vm.suggestions = '';
  }

  function follow(userDes) {
    console.log('_____follow_____');
    vm.suggestions = '';
    Friends.postFriend({
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
  }

  function refuseFriendRequest(user) {
    console.log('_____refuse friends request_____________________');
    console.log(user.userDes);

    console.log($rootScope.currentUser._id);

    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    console.log('save');

    Friends.deleteFriend(user.userId, user.userDes).then(function(response) {
      console.log('delete friend request done');
    });

    Notifications.updateNotification({
      userToDelete: user.id
    }).then(function(response) {
      console.log('remove');
    });

    Notifications.getNotifications().then(function(response) {
      $rootScope.currentUser.notifications = response;
      $rootScope.currentUser.notificationsCount = response.length;

    });
    toaster.pop('warning', 'Vous avez refusé la demande d\'amitié de ' + user.userRec);
  }

  function acceptFriendRequest(user) {
    console.log('_____accept friends request_____________________');
    console.log(user);

    Notifications.updateNotification({
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
    Friends.postFriend({
        usernameAcceptedFriendRequest: user.userRec,
        idUser: user.userId,
    }).then(function(response) {
      console.log('friend posted');
    });
    Notifications.getNotifications().then(function(response) {
      console.log('________________RESPONSE____________');
      console.log(response);
      $rootScope.currentUser.notifications = response;
      $rootScope.currentUser.notificationsCount = response.length;
    });
    toaster.pop('success', 'Vous êtes désormais ami avec : ' +
      user.userRec);
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

  function changePage(page) {
    console.log(page);
    $rootScope.page = page;
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
    var userToken             = $rootScope.currentUser.token;
    $localStorage.currentUser = null;
    $rootScope.currentUser    = null;
    $window.location.href     = '/auth/logout/' + userToken;
    console.log('logout');
  }
}
