angular.module('InTouch')

.factory('Status', Status);

Status.$inject = ['$q', '$http'];

function Status($q, $http) {

  var statusFnct = {
    postStatus: postStatus,
    getStatus: getStatus,
    removeStatus: removeStatus
  };

  return statusFnct;

  function postStatus(status, id) {
    var deferred = $q.defer();
    $http.post('/api/status/' + id, status).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getStatus() {
    var deferred = $q.defer();
    $http.get('/api/status/').success(function(data) {
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

}