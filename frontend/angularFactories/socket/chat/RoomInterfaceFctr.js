RoomInterface.$inject = ['$http', 'Room', '$rootScope', 'Notification', 'Session', '$localStorage'];

function RoomInterface($http, Room, $rootScope, Notification, Session, $localStorage) {
  
  var RoomInterface = function() {
    Room.apply(this, arguments);
  };

  RoomInterface.prototype = Object.create(Room.prototype);
  RoomInterface.prototype.constuctor = AnnounceInterface;

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

  return AuthInterface;

  function sendRoomSockets() {
    console.log('get messages from room');
    var self  this;
    vm.room   = self._roomName;
    vm.roomId = self._id;
    if (self._status === 'create') {
      console.log('CREATE');
      socket.emit('createRoom', {
        roomId: self._roomId,
        roomName: self._roomName
      });
      console.log('room created');
    } else if (self._status === 'join') {
      console.log('JOIN');
      socket.emit('joinRoom', response);
    }
    return ;
  }
}
