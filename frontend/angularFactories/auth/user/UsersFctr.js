angular.module('InTouch')

.factory('Users', Users);

Users.$inject = ['$q', '$http'];

function Users($q, $http) {

  function postUser(username) {
    var deferred = $q.defer();
    $http.post('/api/users/', username).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getUsers() {
    var deferred = $q.defer();
    $http.get('/api/users/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function removeUser(id) {
    var deferred = $q.defer();
    $http.delete('/api/user/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getUserById(id) {
    var deferred = $q.defer();
    console.log('send to api/usershow...');
    $http.get('/api/usershow/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  return {
    getUserById: getUserById,
    postUsername: postUser,
    getUsernames: getUsers,
    removeUsername: removeUser
  };
}