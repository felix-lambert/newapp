angular.module('InTouch')
    .controller('uploadModalCtrl', ['$scope', '$modalInstance', 'settings', '$http', 'selectedImages',
        function($scope, $modalInstance, settings, $http, selectedImages) {
          $scope.images = [];
          $scope.dropfile = {
            options:settings
          };
          $scope.selection = selectedImages || [];

          $scope.$on('filesUploaded', function(e, data) {
            var files = data.response;
            for (var i = 0; i < files.length; i++) {
              $scope.images.push(files[i]);
            }
          });

          function init() {
            $http({
                url:'/api/images',
                method:'GET',
            }).success(function(data) {
              $scope.images = data;
            }).error(function(data) {
              $scope.images = [];
            });
          }
          init();

          $scope.select = function(image) {
            var index = $scope.isSelected(image);
            if (index == -1) {
              $scope.selection.push(image);
            } else {
              $scope.selection.splice(index, 1);
            }
          };

          $scope.isSelected = function(image) {
            for (var i = 0; l = $scope.selection.length, i < l; i++) {
              if ($scope.selection[i].name == image.name) {
                return i;
              }
            }
            return -1;
          };

          $scope.confirm = function() {
            $modalInstance.close($scope.selection);
          };
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        }
]);
