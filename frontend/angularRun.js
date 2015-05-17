var routeObject = {
  '/': {
    templateUrl: '/partials/main.html',
    controller: 'MainAngCtrl',
    controllerAs: 'form'
  },
  '/journal': {
    templateUrl: '/partials/profile/journalPrfl.html',
    controller: 'JournalAngCtrl',
    controllerAs: 'journal'
  },
  '/settings': {
      templateUrl: '/partials/profile/settingsPrfl.html',
      controller: 'SettingsAngCtrl as settings',
      controllerAs: 'settings'
  },
  '/about' : {
    templateUrl: '/partials/profile/AboutPrfl.html',
    controller: 'AboutAngCtrl',
    controllerAs: 'about'
  },
  '/profile': {
    templateUrl: '/partials/profile/profilePrfl.html',
    controller: 'ProfileAngCtrl',
    controllerAs: 'profile'
  },
  '/profile/:id': {
    templateUrl: 'partials/profile/profilePrfl.html',
    controller: 'ProfileAngCtrl',
    controllerAs: 'profile'
  },
  '/profile/show': {
    templateUrl: '/partials/profile/profilePrfl.html',
    controller: 'ProfileAngCtrl',
    controllerAs: 'profile'
  },
  '/profile/reputation': {
    templateUrl: '/partials/profile/reputationPrfl.html',
    controller: 'ReputationAngCtrl',
    controllerAs: 'reputation'
  },
  '/announces': {
    templateUrl: '/partials/announces/listAnnc.html',
    controller: 'AnnouncesAngCtrl as announces',
    controllerAs: 'announces'
  },
  '/announces/create': {
    templateUrl: '/partials/announces/createAnnc.html',
    controller: 'AnnouncesAngCtrl',
    controllerAs: 'announces'
  },
  '/announces/:announceId/edit': {
    templateUrl: '/partials/announces/editAnnc.html',
    controller: 'AnnouncesAngCtrl',
    controllerAs: 'announces'
  },
  '/announces/:announceId': {
    templateUrl: '/partials/announces/viewAnnc.html',
    controller: 'AnnouncesAngCtrl',
    controllerAs: 'announces'
  },
  '/forgot': {
    templateUrl: '/partials/threads/forgot.html',
    controller: 'ForgotAngCtrl',
    controllerAs: 'forgot'
  },
  '/actuality': {
    templateUrl: '/partials/profile/actualityPrfl.html',
    controller: 'ActualityAngCtrl',
    controllerAs: 'actuality'
  },
  '/pictures': {
    templateUrl: '/partials/profile/picturePrfl.html',
    controller: 'PictureAngCtrl',
    controllerAs: 'picture'
  },
  '/transaction': {
    templateUrl: '/partials/transaction/transaction.html',
    controller: 'TransactionAngCtrl',
    controllerAs: 'transaction'
  },
  '/messages': {
    templateUrl: '/partials/profile/messagePrfl.html',
    controller: 'MessageAngCtrl',
    controllerAs: 'message'
  },
  '/historic': {
    templateUrl: '/partials/profile/historicPrfl.html',
    controller: 'HistoricAngCtrl',
    controllerAs: 'historic'
  },
};

angular.module('InTouch').run(['$localStorage', '$rootScope', '$location', 'appLoading',
    function($localStorage, $rootScope, $location, appLoading) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log('________ROUTE TEST_________________');
        appLoading.loading();
        var currentUser = $localStorage.currentUser;
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
]) ;
