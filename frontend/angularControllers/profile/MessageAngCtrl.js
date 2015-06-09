angular.module('InTouch')
  .controller('MessageAngCtrl', MessageAngCtrl);

MessageAngCtrl.$inject = ['Rooms', 'Friends', 'Messages', '$rootScope', 'socket', 'appLoading'];

function MessageAngCtrl(Rooms, Friends, Messages, $rootScope, socket, appLoading) {

  var vm               = this;
  
  vm.focus             = focus;
  vm.typing            = typing;
  vm.startChat         = startChat;
  vm.createRoom        = createRoom;
  vm.joinRoom          = joinRoom;
  vm.leaveRoom         = leaveRoom;
  vm.deleteRoom        = deleteRoom;
  vm.disconnect        = disconnect;
  vm.pageChangeHandler = pageChangeHandler;
  vm.send              = send;
  
  var typing           = false;
  var timeout          = undefined;
  vm.peopleCount       = 0;
  vm.joined            = false;
  vm.showChat          = false;
  vm.rooms             = [];
  vm.error             = {};
  vm.user              = {};
  vm.messages          = [];
  vm.room              = '';
  vm.roomId            = '';
  vm.typingPeople      = [];

  appLoading.ready();

  Rooms.getRooms().then(function(response) {
    console.log(response);
    vm.rooms = response[0];
  });



  /////////////////////////////////////////////////////////////

  function timeoutFunction() {
    typing = false;
    socket.emit('typing', false);
  }

  function focus(bool) {
    vm.focussed = bool;
  }

  function typing(event, user) {
    if (event.which !== 13) {
      if (typing === false && vm.focussed) {
        typing = true;
        console.log(event);
        console.log(user);
        socket.emit('typing', {
          isTyping: true,
          user: user
        });
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1000);
      }
    }
  }

  socket.on('isTyping', function(data) {
    console.log('________________ISTYPING____');
    console.log(data);
    if (data.isTyping === true) {
      console.log('IS TYPING :' + data.person);
      vm.isTyping = data.isTyping;
      vm.typingPeople.push(data.person);
    } else {
      vm.isTyping = data.isTyping;
      var index = vm.typingPeople.indexOf(data.person);
      vm.typingPeople.splice(index, 1);
      vm.typingMessage = '';
    }
  });

  function startChat(user) {
    vm.messages    = [];
    vm.showChat = true;
    console.log('_______________joinROOM______________');
    vm.error.create = '';
    vm.message      = '';
    vm.userRec = user;
    Rooms.postRoom({
      nameRec: user,
      name: $rootScope.currentUser.username
    }).then(function(response) {
      console.log('get messages from room');
      console.log(response.roomId);
      vm.room = response.roomName;
      vm.roomId = response.roomId;
      console.log('___________________ROOMS_____________________');
      if (response.status === 'create') {
        console.log('CREATE');
        socket.emit('createRoom', {
          roomId: response.roomId,
          roomName: response.roomName
        });
        console.log('room created');
      } else if (response.status === 'join') {
        console.log('JOIN');
        socket.emit('joinRoom', {
          roomId: response.roomId,
          roomName: response.roomName
        });
      }
      return Messages.getMessagesFromRoom(response.roomId);
    }).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        vm.messages.push({
          message: response[i].content,
          name: response[i].user
        });
      }
    });
    vm.user   = user;
    vm.joined = true;
  }

  socket.on('usernames', function(data) {
    var html = '';
    for (i = 0; i < data.length; i++) {
      html += data[i];
    }
    console.log($user.html(html));
  });

  socket.on('updateUserDetail', function(data) {
    $rootScope.users = data;
  });

  socket.on('updatePeopleCount', function(data) {
    vm.peopleCount = data.count;
  });

  socket.on('updateRoomsCount', function(data) {
    vm.roomCount = data.count;
  });

  vm.chat      = [];
  vm.usernames = [];
  var filter = vm.filter = {
    category: [],
    rating: null
  };
  vm.pageSize    = 10;
  vm.currentPage = 1;
  vm.user        = '';

  function createRoom() {
    var roomExists = false;
    var room       = this.roomname;
    if (typeof room === 'undefined' ||
      (typeof room === 'string' &&
        room.length === 0)) {
      vm.error.create = 'Please enter a room name';
    } else {
      Rooms.postRoom({
        name: this.roomname
      }).then(function(response) {
        vm.room = response.roomName;
        vm.roomId = response.roomId;
      });
      socket.emit('checkUniqueRoomName', room, function(data) {
        roomExists = data.result;
        if (roomExists) {
          vm.error.create = 'Room ' + room + ' already exists.';
        } else {
          socket.emit('createRoom', room);
          vm.error.create = '';
          if (!vm.user.inroom) {
            vm.messages = [];
            vm.roomname = '';
          }
        }
      });
    }
  }

  function joinRoom(room) {
    vm.messages = [];
    vm.error.create = '';
    vm.message = '';
    socket.emit('joinRoom', room.id);
  }

  function leaveRoom(room) {
    vm.message = '';
    socket.emit('leaveRoom', room.id);
  }

  function deleteRoom(room) {
    vm.message = '';
    socket.emit('deleteRoom', room.id);
  }

  function disconnect() {

    socket.on('disconnect', function() {
      vm.status = 'offline';
      vm.users = 0;
      vm.peopleCount = 0;
    });
  }

  socket.on('sendUserDetail', function(data) {
    vm.user = data;
  });

  socket.on('listAvailableChatRooms', function(data) {
    vm.rooms.length = 0;
    angular.forEach(data, function(room, key) {
      vm.rooms.push({name: room.name, id: room.id});
    });
  });

  socket.on('sendChatMessageHistory', function(data) {
    angular.forEach(data, function(messages, key) {
      vm.messages.push(messages);
    });
  });

  socket.on('connectingToSocketServer', function(data) {
    vm.status = data.status;
  });

  socket.on('usernameExists', function(data) {
    vm.error.join = data.data;
  });

  socket.on('updateUserDetail', function(data) {
    vm.users = data;
  });

  socket.on('updatePeopleCount', function(data) {
    vm.peopleCount = data.count;
  });

  socket.on('updateRoomsCount', function(data) {
    vm.roomCount = data.count;
  });

  function pageChangeHandler(num) {
    console.log('meals page changed to ' + num);
  }

  socket.emit('joinSocketServer', {name: $rootScope.currentUser.username});

  Friends.getFriendsFromUser($rootScope.currentUser._id)
  .then(function(usernames) {
    console.log(usernames);
    for (vm.i = 0; vm.i < usernames.length; vm.i++) {
      if (usernames[vm.i].accepted) {
        console.log(usernames[vm.i]);
        vm.usernames.push(usernames[vm.i].accepted);
      }
    }
    console.log(vm.usernames);
  });

  function send(username, userRec) {
    console.log('send');
    if (typeof this.message === 'undefined' ||
      (typeof this.message === 'string' &&
        this.message.length === 0)) {
      vm.error.send = 'Please enter a message';
    } else {
      console.log(vm.roomId);
      console.log(username);
      Messages.postMessage({
        content: this.message,
        user: username,
        userRec: userRec,
        roomCreator: vm.roomId
      }).then(function(usernames) {
        console.log('save success');
      });

      socket.emit('sendMessage', {
        name: username,
        message: this.message,
        roomId: vm.roomId
      });
      vm.message    = '';
      vm.error.send = '';
    }
  }

  socket.on('sendChatMessage', function(message) {
    console.log('_______________ send _____________________');
    vm.messages.push(message);
  });

  socket.on('updatePeopleCount', function(data) {
    vm.peopleCount = data.count;
  });

  socket.on('listAvailableChatRooms', function(data) {
    angular.forEach(data, function(room, key) {
      vm.rooms.push({name: room.name, id: room.id});
    });
  });
}
