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
    controllerAs: 'listAnnounces'
  },
  '/announces/create': {
    templateUrl: 'partials/announces/createAnnc.html',
    controller: 'CreateAnnounceAngCtrl',
    controllerAs: 'createAnnounce',

  },
  '/announces/:announceId/edit': {
    templateUrl: 'partials/announces/editAnnc.html',
    controller: 'EditAnnounceAngCtrl',
    controllerAs: 'editAnnounce'
  },
  '/announces/:announceId': {
    templateUrl: 'partials/announces/viewAnnc.html',
    controller: 'ShowAnnounceAngCtrl',
    controllerAs: 'showAnnounce'
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
    controllerAs: 'actuality'
  },
  '/pictures': {
    templateUrl: 'partials/profile/picturePrfl.html',
    controller: 'PictureAngCtrl',
    controllerAs: 'picture',
    resolve: {
      preGetImages: function(Images) {
        console.log('preGetRooms');
        return Images.getImages();
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
      preGetRooms: function(Rooms) {
        console.log('preGetRooms');
        return Rooms.getRooms();
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
    var currentUser        = $localStorage.currentUser;
    $rootScope.currentUser = currentUser;
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
