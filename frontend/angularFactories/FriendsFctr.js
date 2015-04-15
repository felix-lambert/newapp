angular.module('InTouch')

.factory('friends', ['$q', '$http', function($q, $http) {

  function postFriend(friend) {
    var deferred = $q.defer();
    $http.post('/api/friends/', friend).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getFriendsFromUser(id) {
    var deferred = $q.defer();
    $http.get('/api/friends/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteFriend(id) {
    var deferred = $q.defer();
    $http.delete('/api/friends/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  return {
    postFriend: postFriend,
    getFriendsFromUser: getFriendsFromUser,
    deleteRoom: deleteFriend
  };

    // return $resource('/api/friends/:userId', {
    //     userId: '@_id'
    // }, {
    //     update: {
    //         method: 'PUT'
    //     }
    // });
}]);