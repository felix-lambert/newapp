angular.module('InTouch')
  .controller('AdminNavbarAngCtrl', ['$scope', '$rootScope', 'Auth',
    '$location', '$localStorage', function($scope, $rootScope, Auth,
      $location, $localStorage) {
      console.log('____AdminNavbarCtrl____');

      defineNavMenu = function() {
        $scope.navMenu = [{
          'title': 'Services',
          'path': '/admin/announces'
        }, {
          'title': 'Users',
          'path': '/admin/users'
        }, {
          'title': 'Categories',
          'path': '/admin/categories'
        }];
      };

      $scope.init = function() {
        defineNavMenu();
      };

      $scope.logout = function() {
        Auth.logout(function(err) {
          if (!err) {
            $location.path('/');
            $rootScope.currentUser = null;
          }
        });
      };
    }]);
