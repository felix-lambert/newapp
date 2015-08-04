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
  // var Auth               = $injector.get('Auth');
  var appLoading         = $injector.get('appLoading');
  var Message             = $injector.get('Message');
  var Friend             = $injector.get('Friend');
  var toaster            = $injector.get('toaster');
  var socket             = $injector.get('socket');
  var Notification       = $injector.get('Notification');
  var Announce           = $injector.get('Announce');
  var AuthService        = $injector.get('AuthService');
  var SearchService      = $injector.get('SearchService');
  var FriendService      = $injector.get('FriendService');
  var NotificationService = $injector.get('NotificationService');

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

  appLoading.ready();

  //////////////////////////////////////////////////////////////////////////
  var announce = new Announce();
  var message = new Message();
  var notification = new Notification();
  var friend = new Friend();

  function Login() {
    console.log('_______________LOG IN____________');
    appLoading.loading();
    var user = AuthService.authenticate(vm.email_username, vm.passwordLog);
    user.getProfile().then(function () {
      if (user._error) {
        swal(user._error, 'Try again', 'warning');
      } else {
        swal('Authentification réussie!', '', 'success');
        $location.path('/');  
      }
      appLoading.ready();
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

  // if ($rootScope.currentUser) {
  //   var userToken                               = $rootScope.currentUser.token;
  //   $http.defaults.headers.common['auth-token'] = userToken;
  //   message.getMessagesFromUser().then(function() {
  //     vm.nbMessages = message._messages.length;
  //     for (var i = 0; i < message._messages.length; i++) {
  //       vm.messages.push({
  //         message: message._messages[i].content,
  //         name: message._messages[i].user
  //       });
  //     }
  //     notification.getNotifications().then(function() {
  //       $rootScope.currentUser.notifications = notification._notifications;
  //       $rootScope.currentUser.notificationsCount = notifications._notifications.length;
  //     });
  //   });
    
  //   socket.on('sendChatMessage', function(message) {
  //     console.log('_______________ send in header_____________________');
  //     toaster.pop('success', 'Un nouveau message a été envoyé');
      
  //     message.getMessagesFromUser()
  //     .then(function() {
  //       vm.nbMessages = message._messages.length;
  //       for (var i = 0; i < message._messages.length; i++) {
  //         vm.messages.push({
  //           message: message._messages[i].content,
  //           name: message._messages[i].user
  //         });
  //       }
  //     });
  //   });

  // }

  var reset = null;
  vm.notification = [];
  socket.on('receiveFriendRequest', function(user) {
    console.log('______receive fiend request__________');
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    if ($rootScope.currentUser) {
      notification.getNotifications().then(function() {
        $rootScope.currentUser.notifications = notification._notifications;
        console.log('________________RESPONSE____________');
        $rootScope.currentUser.notificationsCount = notification._notifications.length;
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
      notification.getNotifications().then(function() {
        $rootScope.currentUser.notifications = notification._notifications;
        console.log('________________RESPONSE____________');
        $rootScope.currentUser.notificationsCount = notification._notifications.length;
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

      notification.getNotifications().then(function() {
        $rootScope.currentUser.notifications = notification._notifications;
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
      console.log('Utilisateurs');
      var search = SearchService.search(vm.searchText);

      search.getSearch().then(function() {
        vm.suggestions = search._searchResult;
        vm.usernameStatuses = search._usernameStatus;
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
    var friend = FriendService.follow(userDes, userId);
    friend.postNotification();
  }

  function refuseFriendRequest(user) {
    console.log('_____refuse friends request_____________________');
    var userToken                               = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    if (user.type === 'friendRequest') {
      friend.setFriendToDelete(user.userId, user.userRec);
      friend.deleteFriend();
      console.log('delete friend request done');
      toaster.pop('warning', 'Vous avez refusé la demande d\'amitié de ' + user.userRec);
    }

    var notification = NotificationService.update(user.id);

    notification.updateNotification();
  }

  function acceptFriendRequest(notification) {
    console.log('_____accept friends request_____________________');
    console.log(notification);
    var notification = NotificationService.update(notification.id);

    notification.postNotification().then(function() {
      
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
      var friend = FriendService.follow(notification.userRec, notification.userId);
      friend.postNotification().then(function() {
        socket.emit('sendAcceptFriendRequest', {
          userRec: notification.userRec,
          userDes: notification.userDes,
          userDesId: notification.userId,
          id: $rootScope.currentUser._id
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
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    $http.delete('/auth/logout/').success(function(response) {
      console.log(response);
      if (response) {
        console.log('test logout');
        console.log($localStorage);
        console.log($rootScope.currentUser);
        $localStorage.searchField = null;
        $localStorage.currentUser = null;
        $rootScope.currentUser = null;
      }
    });
    console.log('logout');
  }
}
