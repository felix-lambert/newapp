angular.module('InTouch')

.factory('Like', Like);

Like.$inject = ['$http'];

function Like($http) {

  var likeFnct = {
    postLike: postLike,
    getLikesFromUser: getLikesFromUser,
    cancelLike: cancelLike
  };

  return likeFnct;

  function postLike(like) {
    var deferred = $q.defer();
    $http.post('/api/like/', like).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getLikesFromUser() {
    var deferred = $q.defer();
    $http.get('/api/like/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function cancelLike(id, user) {
    var deferred = $q.defer();
    $http.delete('/api/like/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

}
