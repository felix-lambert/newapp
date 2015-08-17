angular.module('InTouch')
  .controller('MessageAngCtrl', MessageAngCtrl);

MessageAngCtrl.$inject = ['$localStorage', 'RoomService', 'MessageService', 'Room', 'Friend', 'Message', '$rootScope', 'socket', 'appLoading', 'preGetRooms'];

function MessageAngCtrl($localStorage, RoomService, MessageService, Room, Friend, Message, $rootScope, socket, appLoading, preGetRooms) {

  var vm          = this;
  var Typing      = false;
  var timeout     = undefined;
  
  vm.focus        = focus;
  vm.typing       = typing;
  vm.startChat    = startChat;
  // vm.createRoom   = createRoom;
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
    if (data.isTyping === true) {
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
    vm.messages     = [];
    vm.showChat     = true;
    vm.error.create = '';
    vm.message      = '';
    vm.userRec      = user;
    var room = RoomService.create(user);
    room.postRoomAndSendSocket().then(function() {
      var message = new Message();
      vm.roomId = room._id;
      message.setId(room._id);
      message.getMessagesFromRoom().then(function() {
        for (var i = 0; i < message._messages.length; i++) {
          vm.messages.push({
            message: message._messages[i].content,
            name: message._messages[i].user
          });  
        }
        vm.user   = user;
        vm.joined = true;
      });
    });
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

  // function createRoom() {
  //   var roomExists = false;
  //   var room       = this.roomname;
  //   if (typeof room === 'undefined' ||
  //     (typeof room === 'string' &&
  //       room.length === 0)) {
  //     vm.error.create = 'Please enter a room name';
  //   } else {
  //     room.setRoom
  //     Rooms.postRoom({
  //       name: this.roomname
  //     }).then(function(response) {
  //       vm.room   = response.roomName;
  //       vm.roomId = response.roomId;
  //     });
  //     socket.emit('checkUniqueRoomName', room, function(data) {
  //       roomExists = data.result;
  //       if (roomExists) {
  //         vm.error.create = 'Room ' + room + ' already exists.';
  //       } else {
  //         socket.emit('createRoom', room);
  //         vm.error.create = '';
  //         if (!vm.user.inroom) {
  //           vm.messages = [];
  //           vm.roomname = '';
  //         }
  //       }
  //     });
  //   }
  // }

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
    for (var i = 0; i < friend._friends.length; i++) {
      if (friend._friends[i].accepted) {
        vm.usernames.push(friend._friends[i].accepted);
      }
    }
    vm.nbFriends = friend._friends.length;
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
      
      var message = MessageService.create(vm.message, username, userRec, vm.roomId);
      message.postMessageAndSendSocket();
      // vm.messages.push({
      //   name: username,
      //   message: vm.message, 
      //   roomId: vm.roomId
      // });
      vm.joined = true;
      vm.message = '';
    }
  }

  socket.on('sendChatMessage', function(message) {
    console.log('_______________ sendChatMessage _____________________');
    console.log(message);
    vm.messages.push(message);
  });
}
