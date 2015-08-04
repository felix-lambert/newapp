angular.module('InTouch')
  .controller('MessageAngCtrl', MessageAngCtrl);

MessageAngCtrl.$inject = ['$localStorage', 'RoomService', 'Room', 'Friend', 'Message', '$rootScope', 'socket', 'appLoading', 'preGetRooms'];

function MessageAngCtrl($localStorage, RoomService, Room, Friend, Message, $rootScope, socket, appLoading, preGetRooms) {

  var vm          = this;
  var Typing      = false;
  var timeout     = undefined;
  
  vm.focus        = focus;
  vm.typing       = typing;
  vm.startChat    = startChat;
  vm.createRoom   = createRoom;
  vm.joinRoom     = joinRoom;
  vm.leaveRoom    = leaveRoom;
  vm.deleteRoom   = deleteRoom;
  vm.send         = send;
  vm.peopleCount  = 0;
  vm.joined       = false;
  vm.showChat     = false;
  vm.rooms        = [];
  vm.error        = {};
  vm.user         = {};
  vm.messages     = [];
  vm.room         = '';
  vm.roomId       = '';
  vm.typingPeople = [];
  
  
  vm.usernames    = [];
  
  vm.user         = '';
  
  
  
  var get         = preGetRooms
  
  vm.rooms        = get[0];

  appLoading.ready();

  $localStorage.searchField = null;

  /////////////////////////////////////////////////////////////

  var room = new Room();
  var message = new Message();
  var friend = new Friend();

  function Timeout() {
    Typing = false;
    socket.emit('typing', false);
  }

  function focus(bool) {
    vm.focussed = bool;
  }

  function typing(event, user) {
    if (event.which !== 13) {
      if (Typing === false && vm.focussed) {
        Typing = true;
        console.log(event);
        console.log(user);
        socket.emit('typing', {
          isTyping: true,
          user: user
        });
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(Timeout, 1000);
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
      var index   = vm.typingPeople.indexOf(data.person);
      vm.typingPeople.splice(index, 1);
      vm.typingMessage = '';
    }
  });

  function startChat(user) {
    console.log('_______________joinROOM______________');
    console.log(user);
    vm.messages     = [];
    vm.showChat     = true;
    vm.error.create = '';
    vm.message      = '';
    vm.userRec      = user;
    var room = roomService.create(user);
    room.postRoomAndSendSocket().then(function() {
      var message = message.getMessagesFromRoom(room._roomId);
      return message;
    }).then(function() {
      for (var i = 0; i < message._messages.length; i++) {
        vm.messages.push({
          message: message._messages[i].content,
          name: message._messages[i].user
        });
      }
    });
    vm.user   = user;
    vm.joined = true;
  }

  socket.on('updateUserDetail', function(data) {
    $rootScope.users = data;
  });

  socket.on('updatePeopleCount', function(data) {
    vm.peopleCount = data.count;
  });

  var filter = vm.filter = {
    category: [],
    rating: null
  };

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
        vm.room   = response.roomName;
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
    console.log('join room');
    vm.messages     = [];
    vm.error.create = '';
    vm.message      = '';
    socket.emit('joinRoom', room);
  }

  function leaveRoom(room) {
    vm.message = '';
    socket.emit('leaveRoom', room.id);
  }

  function deleteRoom(room) {
    vm.message = '';
    socket.emit('deleteRoom', room.id);
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

  socket.on('updateUserDetail', function(data) {
    vm.users = data;
  });

  socket.on('updatePeopleCount', function(data) {
    vm.peopleCount = data.count;
  });

  socket.emit('joinSocketServer', {name: $rootScope.currentUser.username});

  friend.getFriendsFromUser()
  .then(function() {
    console.log();
    for (var i = 0; i < friend._usernames.length; i++) {
      if (friends._usernames[i].accepted) {
        vm.usernames.push(friends._usernames[i].accepted);
      }
    }
    vm.nbFriends = vm.usernames.length;
  });

  function send(username, userRec) {
    console.log('__________send__________');
    console.log(username);
    console.log(userRec);
    console.log('____________**********______________________');
    if (typeof vm.message === 'undefined' ||
      (typeof vm.message === 'string' &&
        vm.message.length === 0)) {
      vm.error.send = 'Please enter a message';
    } else {
      var message = messageService.create(user);
      message.postMessageAndSendSocket();
      vm.message    = '';
      vm.error.send = '';
    }
  }

  socket.on('sendChatMessage', function(message) {
    console.log('_______________ sendChatMessage _____________________');
    console.log(message);
    vm.messages.push(message);
  });
}
