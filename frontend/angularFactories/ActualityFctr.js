angular.module('InTouch')

.factory('Actuality', Actuality);

Actuality.$inject = ['$q', '$http'];

function Actuality($q, $http) {

  var actualityFnct = {
    postActuality: postActuality,
    getActualities: getActualities,
    removeActuality: removeActuality
  };

  return actualityFnct;

  function postActuality(actuality) {
    var deferred = $q.defer();
    $http.post('/api/actuality', actuality).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getActualities() {
    var deferred = $q.defer();
    $http.get('/api/actuality/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function removeActuality(id) {
    var deferred = $q.defer();
    $http.delete('/api/actuality/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }
}
