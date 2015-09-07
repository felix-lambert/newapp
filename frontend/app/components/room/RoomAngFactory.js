angular.module('InTouch')

.factory('Room', Room);

Room.$inject = ['$http'];

function Room($http) {

  var Room = function() {
    this._id = '';
    this._roomField = null;
    this._status;
    this._roomName;
  };

  Room.prototype = {
    setField: setField,
    postRoom: postRoom,
    getRooms: getRooms
  };

  return Room;

  function setField(name) {
    this._roomField = {
      nameRec: name  
    };
  }

  function postRoom() {
    var self = this;
    return $http.post('/api/rooms/', self._roomField).then(function(response) {
      self._status = response.data.status;
      self._id = response.data.roomId;
      self._roomName = response.data.roomName;
      return response;
    });
    
  }

  function getRooms() {
    var self = this;
    $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    return $http.get('/api/rooms/').then(function(response) {
      return response;
    });
  }
}
