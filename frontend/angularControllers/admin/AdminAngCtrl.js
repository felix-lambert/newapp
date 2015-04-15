angular.module('InTouch')
  .controller('AdminAngCtrl', ['$scope', '$rootScope', '$http',
    function($scope, $rootScope, $http) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
      $scope.categories                           = [];
      $scope.userEditIndex                        = -1;
      $scope.usr                                  = null;

      $scope.getCategories = function() {
        $http({
            method: 'GET',
            url: '/api/categories',
          })
          .success(function(data, status, headers, config) {
            $scope.categories = data;
          });
      };

      $scope.addCategory = function() {
        $http({
            method: 'POST',
            url: '/api/admin/addCategory',
            data: {
              'title': this.categorieTitle
            }
          })
          .success(function(data, status, headers, config) {
            $scope.categories.push(data);
          });
      };

      $scope.removeCategory = function(id) {
        angular.forEach($scope.categories, function(item, key) {
          if (item._id == id) {
            $http({
              method: 'DELETE',
              url: '/api/admin/removeCategory/' + id,
            });
            $scope.categories.splice(key, 1);
          }
        });
      };

      $scope.getUsersList = function() {
        $http({
            method: 'GET',
            url: '/api/admin/users',
          })
          .success(function(data) {
            $scope.users = data;
          });
      };

      $scope.editUserLine = function(index) {
        $scope.userEditIndex = index;
        $scope.usr           = angular.copy($scope.users[index]);
      };

      $scope.submitUser = function(form) {
        $http({
          method: 'POST',
          url: '/api/admin/users/' + this.usr._id,
          data: this.usr
        })
        .success(function(data) {
          $scope.users[$scope.userEditIndex] = data;
          $scope.userEditIndex               = -1;
        });
      };

    }]);
