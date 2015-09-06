var routeObject = {
  '/': {
    templateUrl: 'partials/main.html',
    controller: 'MainAngCtrl',
    controllerAs: 'auth'
  },
  '/journal': {
    templateUrl: 'partials/profile/journalPrfl.html',
    controller: 'JournalAngCtrl',
    controllerAs: 'journal'
  },
  '/settings': {
      templateUrl: 'partials/profile/settingsPrfl.html',
      controller: 'SettingsAngCtrl',
      controllerAs: 'settings'
  },
  '/about' : {
    templateUrl: 'partials/profile/AboutPrfl.html',
    controller: 'AboutAngCtrl',
    controllerAs: 'about'
  },
  '/profile': {
    templateUrl: 'partials/profile/profilePrfl.html',
    controller: 'ProfileAngCtrl',
    controllerAs: 'profile'
  },
  '/profile/show': {
    templateUrl: 'partials/profile/profilePrfl.html',
    controller: 'ProfileAngCtrl',
    controllerAs: 'profile'
  },
  '/profile/reputation': {
    templateUrl: 'partials/profile/reputationPrfl.html',
    controller: 'ReputationAngCtrl',
    controllerAs: 'reputation'
  },
  '/announces': {
    templateUrl: 'partials/announces/listAnnc.html',
    controller: 'ListAnnouncesAngCtrl',
    controllerAs: 'listAnnounces',
    resolve: {
      preGetAnnounces: function(Announce) {
        var announce = new Announce;
        announce.setAnnouncePagination(1);
        return announce.getAnnounces();     
      }
    }
  },
  '/announces/create': {
    templateUrl: 'partials/announces/createAnnc.html',
    controller: 'CreateAnnounceAngCtrl',
    controllerAs: 'createAnnounce',
    resolve: {
      preGetUserAnnounces: function(Announce, $rootScope, $http) {
        if ($rootScope.currentUser) {
          var userToken                               = $rootScope.currentUser.token;
          $http.defaults.headers.common['auth-token'] = userToken;
          var announce = new Announce();
          announce.setPage(1);
          return announce.getAnnouncesFromUser();
        }
      }
    }
  },
  '/announces/:announceId/edit': {
    templateUrl: 'partials/announces/editAnnc.html',
    controller: 'EditAnnounceAngCtrl',
    controllerAs: 'editAnnounce'
  },
  '/announces/:announceId': {
    templateUrl: 'partials/announces/viewAnnc.html',
    controller: 'ShowAnnounceAngCtrl',
    controllerAs: 'showAnnounce',
    resolve: {
      preShowAnnounce: function(Announce, $routeParams) {
        var announce = new Announce;
        var comment = new Comment;
        announce.setId($routeParams.announceId);
        return announce.getAnnounceById();  
      },
      preShowComment: function(Comment, $routeParams) {
        comment.setId($routeParams.announceId);
        return comment.getAnnounceComments();
      }
    }
  },
  '/message/:userId': {
    templateUrl: 'partials/sendMessage.html',
    controller: 'SendMessageAngCtrl',
    controllerAs: 'sendMessage'
  },
  '/profile/:userId': {
    templateUrl: 'partials/profile/profileView.html',
    controller: 'ProfileViewAngCtrl',
    controllerAs: 'showViewProfile'
  },
  '/forgot': {
    templateUrl: 'partials/threads/forgot.html',
    controller: 'ForgotAngCtrl',
    controllerAs: 'forgot'
  },
  '/actuality': {
    templateUrl: 'partials/profile/actualityPrfl.html',
    controller: 'ActualityAngCtrl',
    controllerAs: 'actuality',
    resolve: {
      preGetActualities: function(Actuality) {
        var actuality = new Actuality();
        return actuality.getActualities();
      }
    }
  },
  '/pictures': {
    templateUrl: 'partials/profile/picturePrfl.html',
    controller: 'PictureAngCtrl',
    controllerAs: 'picture',
    resolve: {
      preGetImages: function(Image) {
        console.log('preGetImages');
        var image = new Image();
        return image.getImages();
      }
    }
  },
  '/transaction': {
    templateUrl: 'partials/transaction/transaction.html',
    controller: 'TransactionAngCtrl',
    controllerAs: 'transaction'
  },
  '/messages': {
    templateUrl: 'partials/profile/messagePrfl.html',
    controller: 'MessageAngCtrl',
    controllerAs: 'message',
    resolve: {
      preGetRooms: function(Room) {
        console.log('preGetRooms');
        var room = new Room();
        return room.getRooms();
      }
    }
  },
  '/historic': {
    templateUrl: 'partials/profile/historicPrfl.html',
    controller: 'HistoricAngCtrl',
    controllerAs: 'historic'
  },
};

angular.module('InTouch').run(appRun);

appRun.$inject = ['$localStorage', '$rootScope', '$location', 'appLoading'];

function appRun($localStorage, $rootScope, $location, appLoading) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    console.log('________ROUTE TEST_________________');
    
    appLoading.loading();
    $rootScope.currentUser = $localStorage.currentUser;
    console.log($rootScope.currentUser);

    for (var i in routeObject) {
      if (next.originalPath == i) {
        if (routeObject[i].requireLogin && !$rootScope.currentUser) {
          console.log(i + ' require log in');
          $location.path('/');
        } else if (routeObject[i].requireAdmin &&
          $rootScope.currentUser.role != 'admin') {
          console.log(i + ' unauthorized');
          $location.path('/');
        } else {
          console.log(i + ' authorized');
        }
      }
    }
  });
}
