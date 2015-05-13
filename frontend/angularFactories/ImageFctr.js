angular.module('InTouch')

.factory('Images', ['$q', '$http', function($q, $http) {


  function getImages() {
    var deferred = $q.defer();
    $http.get('/api/images/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }


  return {
    getImages: getImages
  };

}]);
