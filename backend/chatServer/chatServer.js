/////////////////////////////////////////////////////////////////
// HOOK SOCKET.IO INTO EXPRESS //////////////////////////////////
/////////////////////////////////////////////////////////////////
var uuid        = require('node-uuid');
var rooms       = {};
var people      = {};
var _           = require('underscore')._;
var sockets     = [];
var Room        = require('./room');
var chatHistory = {};
var users       = {};

module.exports = function(server) {

  var io = require('socket.io').listen(server);
  io.set('log level', 1);

  io.sockets.on('connection', function(socket) {

    socket.on('disconnect', function(data) {
      if (!socket.nickname) {
        return;
      }
      delete users[socket.nickname];
      updateNicknames();
    });

    totalPeopleOnline = _.size(people);

    io.sockets.emit('updatePeopleCount', {count: totalPeopleOnline});

    totalRooms = _.size(rooms);

    io.sockets.emit('updateRoomsCount', {count: totalRooms});
    sendToSelf(socket, 'connectingToSocketServer', {
      status: 'online',
    });

    socket.on('sendFriendRequest', function(user) {
      io.sockets.emit('receiveFriendRequest', user);
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
      io.sockets.in(socket.room).emit('isTyping', {isTyping: data.isTyping, person: data.user});
    });

    socket.on('joinSocketServer', function(data) {
      var exists = false;
      _.find(people, function(k, v) {
        if (k.name.toLowerCase() === data.name.toLowerCase()) {
          return exists = true;
        }
      });

      if (!exists) {
        people[socket.id] = {name: data.name};
        people[socket.id].inroom = null; //setup 'default' room value
        people[socket.id].owns = null;
        totalPeopleOnline = _.size(people);
        totalRooms = _.size(rooms);
        io.sockets.emit('updateRoomsCount', {count: totalRooms});
        io.sockets.emit('updateUserDetail', people);
        io.sockets.emit('updatePeopleCount', {count: totalPeopleOnline});
        sendToSelf(socket, 'joinedSuccessfully'); //useragent and geolocation detection
        io.sockets.emit('updateUserDetail', people);
        sockets.push(socket); //keep a collection of all connected clients
      }
    });

    socket.on('joinRoom', function(username) {
      console.log('________________JOIN ROOM_______________');
      var flag = false;
      var room = rooms[username.roomId];
      if (!flag) {
        socket.room = username.roomName;
        socket.join(socket.room);

        //roomToJoin.addPerson(socket.id);
        //people[socket.id].inroom = username.roomId;
        // people[socket.id].roomname = username.roomName;
        io.sockets.emit('updateUserDetail', people);
        sendToSelf(socket, 'sendUserDetail', people[socket.id]);
      }
    });

    socket.on('createRoom', function(data) {
      console.log('NEW ROOM_________ CRETA ROOOM');
      var flag = false;
      if (!flag) {
        console.log('createRoom');
        var roomName = data.roomName;
        var uniqueRoomID = data.roomId; //guarantees uniquness of room

        var room = new Room(roomName, uniqueRoomID, socket.id);

        people[socket.id].roomname = roomName;
        room.addPerson(socket.id);
        rooms[uniqueRoomID] = room;
        socket.room = roomName;
        socket.join(socket.room);
        totalRooms = _.size(rooms);
        io.sockets.emit('updateRoomsCount', {count: totalRooms});
        io.sockets.emit('updateRoomsCount', {count: totalRooms});
        io.sockets.emit('listAvailableChatRooms', rooms);
        io.sockets.emit('updateUserDetail', people);
        sendToSelf(socket, 'sendUserDetail', people[socket.id]);
        chatHistory[socket.room] = []; //initiate chat history
      }
    });

  });
};

sendToSelf = function(socket, method, data) {
  console.log('send to self');
  socket.emit(method, data);
};
