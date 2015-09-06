angular.module('InTouch')
  .factory('RoomInterface', RoomInterface);

RoomInterface.$inject = ['socket', '$http', 'Room'];

function RoomInterface(socket, $http, Room) {
  
  var RoomInterface = function() {
    Room.prototype.setField.apply(this, arguments);
  };

  RoomInterface.prototype = Object.create(Room.prototype);
  RoomInterface.prototype.constuctor = RoomInterface;

  RoomInterface.prototype.postRoomAndSendSocket =  function() {
    
    var room = Room.prototype.postRoom.apply(this, arguments);

    var self = this;
    return room.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return sendRoomSockets.call(self);
    });
  }

  return RoomInterface;

  function sendRoomSockets() {
    console.log('get messages from room');
    var self = this;
    console.log(self);
    if (self._status === 'create') {
      console.log('CREATE');
      socket.emit('createRoom', self._id, self._roomName);
      console.log('room created');
    } else if (self._status === 'join') {
      socket.emit('joinRoom', self._id, self._roomName);
    }
  }
}
