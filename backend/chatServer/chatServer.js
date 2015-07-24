/////////////////////////////////////////////////////////////////
// HOOK SOCKET.IO INTO EXPRESS //////////////////////////////////
/////////////////////////////////////////////////////////////////
var rooms   = {};
var people  = {};
var _       = require('underscore')._;
var sockets = [];
var Room    = require('./room');

module.exports = function(server) {

  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {

    totalPeopleOnline = _.size(people);

    io.sockets.emit('updatePeopleCount', {count: totalPeopleOnline});
    io.sockets.emit('updateUserDetail', people);

    totalRooms = _.size(rooms);

    io.sockets.emit('updateRoomsCount', {count: totalRooms});
    socket.emit('connectingToSocketServer', {
      status: 'online',
    });

    socket.on('sendFriendRequest', function(user) {
      io.sockets.emit('receiveFriendRequest', user);
    });

    socket.on('sendLike', function(user) {
      console.log('__________SEND LIKE___________');
      io.sockets.emit('receiveLike', user);
    });

    socket.on('sendAcceptFriendRequest', function(user) {
      console.log('receiveAcceptFriendRequest');
      io.sockets.emit('receiveAcceptFriendRequest', user);
    });

    socket.on('sendMessage', function(data) {
      console.log('SEND MESSAGE');
      io.sockets.in(socket.room).emit('sendChatMessage', data);
    });

    socket.on('typing', function(data, user) {
      io.sockets.in(socket.room).emit('isTyping',
        {isTyping: data.isTyping, person: data.user});
    });

    socket.on('disconnect', function() {
      console.log('disconnect');
      if (typeof people[socket.id] !== 'undefined') { //this handles the refresh of the name screen
        purgatory.purge(socket, 'disconnect');
      }
    });

    socket.on('joinSocketServer', function(data) {
      var exists = false;
      _.find(people, function(k, v) {
        if (k.name.toLowerCase() === data.name.toLowerCase()) {
          exists = true;
          return exists;
        }
      });

      if (!exists) {
        people[socket.id]        = {name: data.name};
        people[socket.id].inroom = null;
        people[socket.id].owns   = null;
        totalPeopleOnline        = _.size(people);
        totalRooms               = _.size(rooms);
        io.sockets.emit('updateRoomsCount', {count: totalRooms});
        io.sockets.emit('updateUserDetail', people);
        io.sockets.emit('updatePeopleCount', {count: totalPeopleOnline});

        io.sockets.emit('joinedSuccessfully');
        io.sockets.emit('updateUserDetail', people);
        sockets.push(socket);
      }
    });

    socket.on('joinRoom', function(username) {
      console.log('________________JOIN ROOM_______________');
      console.log(username);
      var room = rooms[username.roomId];
      socket.room = username.roomName;
      socket.join(socket.room);
      io.sockets.emit('updateUserDetail', people);
      io.sockets.emit('sendUserDetail', people[socket.id]);
    });

    socket.on('createRoom', function(data) {
      console.log('NEW ROOM_________ CRETA ROOOM');
      console.log('createRoom');
      console.log(data);
      var roomName     = data.roomName;
      var uniqueRoomID = data.roomId;

      var room = new Room(roomName, uniqueRoomID, socket.id);

      people[socket.id].roomname = roomName;
      room.addPerson(socket.id);
      rooms[uniqueRoomID] = room;
      socket.room         = roomName;
      socket.join(socket.room);
      totalRooms = _.size(rooms);
      io.sockets.emit('updateRoomsCount', {count: totalRooms});
      io.sockets.emit('updateRoomsCount', {count: totalRooms});
      io.sockets.emit('listAvailableChatRooms', rooms);
      io.sockets.emit('updateUserDetail', people);
      socket.emit('sendUserDetail', people[socket.id]);
    });

  });
};
