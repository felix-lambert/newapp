angular.module('InTouch')

.factory('friends', friends);

friends.$inject = ['$q', '$http'];

function friends($q, $http) {

  var friendsFnct = {
    postFriend: postFriend,
    getFriendsFromUser: getFriendsFromUser,
    deleteFriend: deleteFriend
  };

  return friendsFnct;

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

  function deleteFriend(id, user) {
    var deferred = $q.defer();
    $http.delete('/api/friends/' + id + '/' + user).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

}
