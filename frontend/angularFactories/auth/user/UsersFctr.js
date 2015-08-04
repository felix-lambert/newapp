angular.module('InTouch')

.factory('Users', Users);

Users.$inject = ['$q', '$http'];

console.log('UsersFctr');

function Users($q, $http) {
  
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
    getUserById: getUserById
  };
}