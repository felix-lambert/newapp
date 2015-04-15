angular.module('InTouch')

.factory('Status', ['$q', '$http', function($q, $http) {

  function postStatus(status, id) {
    var deferred = $q.defer();
    $http.post('/api/status/' + id, status).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getStatus(id) {
    var deferred = $q.defer();
    $http.get('/api/status/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function removeStatus(id) {
    var deferred = $q.defer();
    $http.delete('/api/status/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  return {
    postStatus: postStatus,
    getStatus: getStatus,
    removeStatus: removeStatus
  };

}]);
