angular.module('InTouch')

.factory('Friends', Friends);

Friends.$inject = ['$q', '$http'];

function Friends($q, $http) {

  var friendsFnct = {
    postFriend: postFriend,
    getFriendsFromUser: getFriendsFromUser,
    deleteFriend: deleteFriend,
    testIfFriend:testIfFriend,
    countFriends: countFriends
  };

  return friendsFnct;

  function testIfFriend(friend) {
    var deferred = $q.defer();
    $http.get('/api/friends/' + friend.username)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function countFriends(friend) {
    var deferred = $q.defer();
    $http.get('/api/countfriends/' + friend.idUser)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function postFriend(friend) {
    var deferred = $q.defer();
    $http.post('/api/friends/', friend).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getFriendsFromUser() {
    var deferred = $q.defer();
    $http.get('/api/getfriends/').success(function(data) {
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
