angular.module('InTouch')
    .controller('NavbarAngCtrl', ['$scope', '$rootScope', 'Auth', '$location',
      '$route', function($scope, $rootScope, Auth, $location, $route) {
          console.log('____NavBarCtrl____');

          $scope.$watchCollection('data.tags', function(val) {
            console.log(val);
          });
          defineNavMenu = function() {
            $scope.navMenu = [{
                  'title': 'Accueil',
                  'path': '/',
                  'show': 1,
                  'classIcon': 'iHome'
              }, {
                  'title': 'Profile',
                  'path': '/profile',
                  'show': -2,
                  'classIcon': 'iProfile',
              }, {
                  'title': 'Services',
                  'path': '/announces',
                  'show': 1,
                  'classIcon': 'iService'
              }, {
                  'title': 'Message',
                  'path': '/messages',
                  'show': -2,
                  'classIcon': 'iMessage',
              }, {
                  'title': 'Actualités',
                  'path': '/actuality',
                  'show': -2,
                  'classIcon': 'iService'
              }, {
                  'title': 'Photos',
                  'path': '/pictures',
                  'show': -2,
                  'classIcon': 'iPicture',
              }, {
                  'title': 'Transactions',
                  'path': '/transaction',
                  'show': -2,
                  'classIcon': 'iMoney',
              }, {
                  'title': 'Historiques',
                  'path': '/historic',
                  'show': -2,
                  'classIcon': 'iHistory',
              },
              {
                  'title': 'Paramètres',
                  'path': '/settings',
                  'show': -2
              }];
            $scope.$watch('currentUser', function() {
              angular.forEach($scope.navMenu, function(item, key) {
                if (item.show != 1 && $rootScope.currentUser) {
                  item.show = 2;
                }
              });
            });
          };

          $scope.changeIx = function(value) {
            $scope.ix = value;
          };

          $scope.init = function() {
            defineNavMenu();
            var navBar = $scope.navMenu;
            angular.forEach(navBar, function(item, key) {
              if (item.path == $route.current.originalPath) {
                $scope.ix = key;
              }
            });
          };

          $scope.logout = function() {
            console.log('**************logout******************');
            Auth.logout(function(err) {
              if (!err) {
                $location.path('/');
              }
            });
            $scope.user = {};
          };
        }
]);
