angular.module('InTouch')

.factory('Room', Room);

Room.$inject = ['$q', '$http'];

function Room($q, $http) {

  var Room = function() {
    this._id = '';
    this._roomField = null;
  };

  Room.prototype = {
    setRoomField: setRoomField,
    postRoom: postRoom,
    getRooms: getRooms
  };

  return Room;

  function setRoomField(name) {
    this._roomField = {
      nameRec: name  
    };
  }

  function postRoom() {
    var self = this;
    $http.post('/api/rooms/', self._roomField).then(function(response) {
      return response;
    });
    
  }

  function getRooms() {
    var self = this;
    $http.get('/api/rooms/').then(function(response) {
      return response;
    });
  }
}
