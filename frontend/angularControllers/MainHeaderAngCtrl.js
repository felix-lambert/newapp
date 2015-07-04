angular.module('InTouch')
  .controller('MainHeaderAngCtrl', MainHeaderAngCtrl);

function arrayIndexOf(myArray, searchTerm) {
  console.log(myArray);
  console.log(searchTerm);
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm[0]) {
      return i;
    }
  }
  return -1;
}

MainHeaderAngCtrl.$inject = ['$injector', '$localStorage', '$window',
'$route', '$modal', '$http', '$rootScope', '$location'];

function MainHeaderAngCtrl($injector, $localStorage, $window, $route,
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
    var userToken                               = $rootScope.currentUser.token;
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
      console.log('define currentUser ! ');
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
    appLoading.loading();
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
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
          Friends.getFriendsFromUser($rootScope.currentUser._id)
          .then(function(usernames) {
            console.log(usernames);
            for (var i = 0; i < usernames.length; i++) {
              vm.usernames[i] = usernames[i].accepted ?
              usernames[i].accepted : usernames[i].wait;
              console.log('test');
              console.log(vm.usernames[i]);
            }
            console.log('test data follow');
            for (var j = 0; j < data.length; j++) {
              // Enlever le search de la boucle
              var search = data[j]._source.username;
              console.log(vm.usernames);
              var indexOfArray = arrayIndexOf(vm.usernames, search);
              data[j]._source.username = indexOfArray < 0 ? {
                  'follow': data[j]._source.username
              } : {
                  'notFollow': data[j]._source.username
              };
            }
            console.log('put data in suggestions');
            console.log(data);
            vm.suggestions = data;
            vm.usernames   = usernames;
          });
        } else {
          for (var j = 0; j < data.length; j++) {
            var search = data[j];
            data[j] = {
                'notFollow': data[j]._source.username
            };
          }
          console.log(vm.suggestions);
          vm.suggestions = data._source.username;
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

    Notifications.postNotification({
      userDes: userDes[0],
      user: $rootScope.currentUser.username,
      userId: $rootScope.currentUser._id,
      userDesId: userDes[1],
      type: 'friendRequest'
    }).then(function(response) {
      console.log('notifications success');
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

  function acceptFriendRequest(user) {
    console.log('_____accept friends request_____________________');
    console.log(user);

    Notifications.updateNotification({
      userToDelete: user.id,
    }).then(function(res) {
      console.log('remove');
    });

    Notifications.postNotification({
      userDes: user.userDes,
      user: user.userRec,
      userId: $rootScope.currentUser._id,
      userDesId: user.userDesId,
      type: 'accept'
      }).then(function(response) {
        console.log('notifications success');
      });

    socket.emit('sendAcceptFriendRequest', {
      userRec: user.userRec,
      userDes: user.userDes,
      userDesId: user.userId,
      id: $rootScope.currentUser._id
    });
    var userToken                               = $rootScope.currentUser.token;
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
      $rootScope.currentUser.notifications      = response;
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

    $http.delete('/auth/logout/')
      .success(function(data) {
        console.log(data);
        if (data) {
          console.log('test logout');
          $localStorage.currentUser = null;
          $rootScope.currentUser    = null;
        }
    });
    console.log('logout');
  }
}
