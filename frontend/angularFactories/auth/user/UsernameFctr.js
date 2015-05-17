angular.module('InTouch')

.factory('Username', Username);

Username.$inject = ['$q', '$http'];

function Username($q, $http) {

  function postUsername(username) {
    var deferred = $q.defer();
    $http.post('/api/usernames/', username).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getUsernames() {
    var deferred = $q.defer();
    $http.get('/api/usernames/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function removeUsername(id) {
    var deferred = $q.defer();
    $http.delete('/api/usernames/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  return {
    postUsername: postUsername,
    getUsernames: getUsernames,
    removeUsername: removeUsername
  };

}