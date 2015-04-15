var app = angular.module('InTouch', [
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngMessages',
  'ui.bootstrap',
  'config',
  'ngStorage',
  'toaster',
  'door3.css',
  'angularUtils.directives.dirPagination',
  'KamikyUploader',
  'ngDragDrop'
]);

var routeObject = {
	'/': {
		templateUrl: '/partials/main.html',
		controller: 'MainAngCtrl as form',
		css: '../stylesheets/kamiky.css'
	},
	'/api/profile/:id': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'MainAngCtrl as form',
		css: '../stylesheets/kamiky.css'
	},
  '/journal': {
        templateUrl: '/partials/profile/journalPrfl.html',
        controller: 'JournalAngCtrl',
        css: '../stylesheets/kamiky.css',
    },
    '/settings': {
        templateUrl: '/partials/profile/settingsPrfl.html',
        controller: 'SettingsAngCtrl',
        css: '../stylesheets/kamiky.css',
    },
    '/about' : {
      templateUrl: '/partials/profile/AboutPrfl.html',
      controller: 'AboutAngCtrl'
    },
	'/profile': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/profile/:id': {
		templateUrl: 'partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/profile/show': {
		templateUrl: '/partials/profile/profilePrfl.html',
		controller: 'ProfileAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/profile/reputation': {
		templateUrl: '/partials/profile/reputationPrfl.html',
		controller: 'ReputationAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/announces': {
		templateUrl: '/partials/announces/listAnnc.html',
		controller: 'AnnouncesAngCtrl',
		css: '../stylesheets/kamiky.css'
	},
	'/announces/create': {
		templateUrl: '/partials/announces/createAnnc.html',
		controller: 'AnnouncesAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/announces/:announceId/edit': {
		templateUrl: '/partials/announces/editAnnc.html',
		controller: 'AnnouncesAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/announces/:announceId': {
		templateUrl: '/partials/announces/viewAnnc.html',
		controller: 'AnnouncesAngCtrl',
		css: '../stylesheets/kamiky.css'
	},
	'/forgot': {
		templateUrl: '/partials/threads/forgot.html',
		controller: 'ForgotAngCtrl',
		css: '../stylesheets/kamiky.css'
	},
	'/actuality': {
		templateUrl: '/partials/profile/actualityPrfl.html',
		controller: 'ActualityAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/pictures': {
		templateUrl: '/partials/profile/picturePrfl.html',
		controller: 'PictureAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/transaction': {
		templateUrl: '/partials/transaction/transaction.html',
		controller: 'TransactionAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/messages': {
		templateUrl: '/partials/profile/messagePrfl.html',
		controller: 'MessageAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/historic': {
		templateUrl: '/partials/profile/historicPrfl.html',
		controller: 'HistoricAngCtrl',
		css: '../stylesheets/kamiky.css',
		requireLogin: true,
	},
	'/api/profile?access_token=:id': {
		templateUrl: '/partials/profile/reputationPrfl.html',
		controller: 'ReputationAngCtrl',
		css: '../stylesheets/kamiky.css'
	},
	'/admin': {
		templateUrl: '/partials/admin/announcesAdmin.html',
		controller: 'AdminAngCtrl',
		css: '../stylesheets/admin.css',
		requireAdmin: true,
		requireLogin: true,
	},
	'/admin/announces': {
		templateUrl: '/partials/admin/announcesAdmin.html',
		controller: 'AdminAngCtrl',
		css: '../stylesheets/admin.css',
		requireAdmin: true,
		requireLogin: true,
	},
	'/admin/users': {
		templateUrl: '/partials/admin/usersAdmin.html',
		controller: 'AdminAngCtrl',
		css: '../stylesheets/admin.css',
		requireAdmin: true,
		requireLogin: true,
	},
	'/admin/categories': {
		templateUrl: '/partials/admin/categoriesAdmin.html',
		controller: 'AdminAngCtrl',
		css: '../stylesheets/admin.css',
		requireAdmin: true,
		requireLogin: true,
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
  .run(function($localStorage, $rootScope, $location) {
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
  });
