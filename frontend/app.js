var app = angular.module('InTouch', [
  'ngResource',
  'ngRoute',
  'ngMessages',
  'ui.bootstrap',
  'config',
  'ngStorage',
  'toaster',
  'door3.css',
  'angularFileUpload'
]);

var routeObject = {
  '/': {
		templateUrl: '/partials/main.html',
		controller: 'MainAngCtrl as form'
	},
	'/api/profile/:id': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'MainAngCtrl as form',
	},
  '/journal': {
    templateUrl: '/partials/profile/journalPrfl.html',
    controller: 'JournalAngCtrl',
  },
  '/settings': {
      templateUrl: '/partials/profile/settingsPrfl.html',
      controller: 'SettingsAngCtrl',
  },
  '/about' : {
    templateUrl: '/partials/profile/AboutPrfl.html',
    controller: 'AboutAngCtrl'
  },
	'/profile': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl'
	},
	'/profile/:id': {
		templateUrl: 'partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl',
	},
	'/profile/show': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl'
	},
	'/profile/reputation': {
		templateUrl: '/partials/profile/reputationPrfl.html',
		controller: 'ReputationAngCtrl'
	},
	'/announces': {
		templateUrl: '/partials/announces/listAnnc.html',
		controller: 'AnnouncesAngCtrl'
	},
	'/announces/create': {
		templateUrl: '/partials/announces/createAnnc.html',
		controller: 'AnnouncesAngCtrl',
	},
	'/announces/:announceId/edit': {
		templateUrl: '/partials/announces/editAnnc.html',
		controller: 'AnnouncesAngCtrl',
	},
	'/announces/:announceId': {
		templateUrl: '/partials/announces/viewAnnc.html',
		controller: 'AnnouncesAngCtrl',
	},
	'/forgot': {
		templateUrl: '/partials/threads/forgot.html',
		controller: 'ForgotAngCtrl',
	},
	'/actuality': {
		templateUrl: '/partials/profile/actualityPrfl.html',
		controller: 'ActualityAngCtrl',
	},
	'/pictures': {
		templateUrl: '/partials/profile/picturePrfl.html',
		controller: 'PictureAngCtrl',
	},
	'/transaction': {
		templateUrl: '/partials/transaction/transaction.html',
		controller: 'TransactionAngCtrl',
	},
	'/messages': {
		templateUrl: '/partials/profile/messagePrfl.html',
		controller: 'MessageAngCtrl',
	},
	'/historic': {
		templateUrl: '/partials/profile/historicPrfl.html',
		controller: 'HistoricAngCtrl',
	},
	'/api/profile?access_token=:id': {
		templateUrl: '/partials/profile/reputationPrfl.html',
		controller: 'ReputationAngCtrl'
	},
};

app.config(['$httpProvider', '$routeProvider', '$locationProvider',
  function($httpProvider, $routeProvider, $locationProvider) {

    for (var path in routeObject) {
      $routeProvider.when(path, routeObject[path]);
    }
    $routeProvider.otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }])
  .run(['$localStorage', '$rootScope', '$location',
    function($localStorage, $rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      console.log('________ROUTE TEST_________________');

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
  }]);
