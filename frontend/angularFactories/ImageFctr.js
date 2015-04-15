angular.module('InTouch')
.factory('ImageFct', ['$resource', '$http', function($resource, $http) {
  return $resource('/api/images/:id', {
      id: '@_id'
  }, {
      update : {
          method: 'PUT'
      }
  });
}]);
