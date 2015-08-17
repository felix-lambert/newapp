angular.module('InTouch')

.factory('Friend', Friend);

Friend.$inject = ['$q', '$http'];

function Friend($q, $http) {

  var Friend = function() {
    this._id = '';
    this._friend = '';
    this._friendField = null;
    this._friends = null;
    this._nbFriend = 0;
  };

  Friend.prototype = {
    setId: setId,
    setField: setField,
    setFriend: setFriend,
    setFriendToDelete: setFriendToDelete,
    postFriend: postFriend,
    getFriendsFromUser: getFriendsFromUser,
    deleteFriend: deleteFriend,
    testIfFriend: testIfFriend,
    countFriend: countFriend
  };

  return Friend;

  function setId(id) {
    this._id = id;
  }

  function setFriend(friend) {
    this._friend = friend;
  }

  function setField(userDes, userId, type) {
    if (type === 'wait') {
      this._friendField = {
        usernameWaitFriendRequest: userDes,
        idUser: userId
      };
    } else {
      this._friendField = {
        usernameAcceptedFriendRequest: userDes,
        idUser: userId
      };
    }
  }

  function setFriendToDelete(id, user) {
    this._id = id;
    this._friend = user;
  }

  function testIfFriend() {
    var self = this;
    return $http.get('/api/friends/' + this._friend)
    .then(function(response) {
      return response;
    });
  }

  function countFriend() {
    var self = this;
    return $http.get('/api/countfriends/' + this._id)
    .then(function(response) {
      self._nbFriends = response.data;
      return response;
    });
  }

  function postFriend() {
    var self = this;
    return $http.post('/api/friends/', this._friendField)
    .then(function(response) {
      return response;
    });
  }

  function getFriendsFromUser() {
    var self = this;
    return $http.get('/api/getfriends/')
    .then(function(response) {
      self._friends = response.data;
      return response;
    });
  }

  function deleteFriend() {
    var self = this;
    return $http.delete('/api/friends/' + self._id + '/' + self._friend)
    .then(function(response) {
      return response;
    });
  }

}
