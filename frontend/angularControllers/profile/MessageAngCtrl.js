angular.module('InTouch')
  .controller('MessageAngCtrl', ['rooms', 'friends',
    '$modal', '$scope', 'User', 'messages', '$rootScope',
    'socket',
    function(rooms, friends, $modal, $scope, User, messages,
      $rootScope, socket) {

      $scope.peopleCount  = 0;
      $scope.joined       = false;
      $scope.showChat     = false;
      $scope.rooms        = [];
      $scope.error        = {};
      $scope.user         = {};
      $scope.messages     = [];
      $scope.room         = '';
      $scope.roomId       = '';
      $scope.typingPeople = [];
      var typing          = false;
      var timeout         = undefined;

      rooms.getRooms().then(function(response) {
        console.log(response);
        $scope.rooms = response[0];
      });

      function timeoutFunction() {
        typing = false;
        socket.emit('typing', false);
      }

      $scope.focus = function(bool) {
        $scope.focussed = bool;
      };

      $scope.typing = function(event, user) {
        if (event.which !== 13) {
          if (typing === false && $scope.focussed) {
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
      };

      socket.on('isTyping', function(data) {
        console.log('________________ISTYPING____');
        console.log(data);
        if (data.isTyping === true) {
          console.log('IS TYPING :' + data.person);
          $scope.isTyping = data.isTyping;
          $scope.typingPeople.push(data.person);
        } else {
          $scope.isTyping = data.isTyping;
          var index = $scope.typingPeople.indexOf(data.person);
          $scope.typingPeople.splice(index, 1);
          $scope.typingMessage = '';
        }
      });

      function timeoutFunction() {
        typing = false;
        socket.emit('typing', false);
      }

      $scope.startChat = function(user) {
        $scope.messages    = [];
        $scope.showChat = true;
        console.log('_______________joinROOM______________');
        $scope.error.create = '';
        $scope.message      = '';
        $scope.userRec = user;
        rooms.postRoom({
          nameRec: user,
          name: $rootScope.currentUser.username
        }).then(function(response) {
          console.log('get messages from room');
          console.log(response.roomId);
          $scope.room = response.roomName;
          $scope.roomId = response.roomId;
          console.log('___________________ROOMS_____________________');
          console.log($scope.room);
          console.log('___________________ROOM ID___________________');
          console.log($scope.roomId);
          if (response.status === 'create') {
            console.log('CREATE');
            socket.emit('createRoom', {
              roomId: response.roomId,
              roomName: response.roomName
            });
          } else if (response.status === 'join') {
            console.log('JOIN');
            socket.emit('joinRoom', {
              roomId: response.roomId,
              roomName: response.roomName
            });
          }
          return messages.getMessagesFromRoom(response.roomId);
        }).then(function(response) {
          for (var i = 0; i < response.length; i++) {
            $scope.messages.push({
              message: response[i].content,
              name: response[i].user
            });
          }
        });
        $scope.user         = user;
        $scope.joined       = true;
      };

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
        $scope.peopleCount = data.count;
      });

      socket.on('updateRoomsCount', function(data) {
        $scope.roomCount = data.count;
      });

      $scope.chat      = [];
      $scope.usernames = [];
      var filter = $scope.filter = {
        category: [],
        rating: null
      };
      $scope.pageSize    = 10;
      $scope.currentPage = 1;
      $scope.user        = '';

      $scope.createRoom = function() {
        var roomExists = false;
        var room = this.roomname;
        if (typeof room === 'undefined' ||
          (typeof room === 'string' &&
            room.length === 0)) {
          $scope.error.create = 'Please enter a room name';
        } else {
          rooms.postRoom({
          name: this.roomname
        }).then(function(response) {
          console.log('get messages from room');
          console.log(response.roomId);
          $scope.room = response.roomName;
          $scope.roomId = response.roomId;
          console.log('___________________ROOMS_____________________');
          console.log($scope.room);
          console.log('___________________ROOM ID___________________');
          console.log($scope.roomId);
        });
          socket.emit('checkUniqueRoomName', room, function(data) {
            roomExists = data.result;
            if (roomExists) {
              $scope.error.create = 'Room ' + room + ' already exists.';
            } else {
              socket.emit('createRoom', room);
              $scope.error.create = '';
              if (!$scope.user.inroom) {
                $scope.messages = [];
                $scope.roomname = '';
              }
            }
          });
        }
      };

      $scope.joinRoom = function(room) {
        $scope.messages = [];
        $scope.error.create = '';
        $scope.message = '';
        socket.emit('joinRoom', room.id);
      };

      $scope.leaveRoom = function(room) {
        $scope.message = '';
        socket.emit('leaveRoom', room.id);
      };

      $scope.deleteRoom = function(room) {
        $scope.message = '';
        socket.emit('deleteRoom', room.id);
      };

      $scope.disconnect = function() {

        socket.on('disconnect', function() {
          $scope.status = 'offline';
          $scope.users = 0;
          $scope.peopleCount = 0;
        });
      };

      socket.on('sendUserDetail', function(data) {
        $scope.user = data;
      });

      socket.on('listAvailableChatRooms', function(data) {
        $scope.rooms.length = 0;
        angular.forEach(data, function(room, key) {
          $scope.rooms.push({name: room.name, id: room.id});
        });
      });

      socket.on('sendChatMessage', function(message) {
        $scope.messages.push(message);
      });

      socket.on('sendChatMessageHistory', function(data) {
        angular.forEach(data, function(messages, key) {
          $scope.messages.push(messages);
        });
      });

      socket.on('connectingToSocketServer', function(data) {
        $scope.status = data.status;
      });

      socket.on('usernameExists', function(data) {
        $scope.error.join = data.data;
      });

      socket.on('updateUserDetail', function(data) {
        $scope.users = data;
      });

      socket.on('updatePeopleCount', function(data) {
        $scope.peopleCount = data.count;
      });

      socket.on('updateRoomsCount', function(data) {
        $scope.roomCount = data.count;
      });

      $scope.pageChangeHandler = function(num) {
        console.log('meals page changed to ' + num);
      };

      socket.emit('joinSocketServer', {name: $rootScope.currentUser.username});

      friends.getFriendsFromUser($rootScope.currentUser._id)
      .then(function(usernames) {
        console.log(usernames);
        for ($scope.i = 0; $scope.i < usernames.length; $scope.i++) {
          if (usernames[$scope.i].accepted) {
            console.log(usernames[$scope.i]);
            $scope.usernames.push(usernames[$scope.i].accepted);
          }
        }
        console.log($scope.usernames);
      });

      $scope.send = function(username) {
        console.log('send');
        if (typeof this.message === 'undefined' ||
          (typeof this.message === 'string' &&
            this.message.length === 0)) {
          $scope.error.send = 'Please enter a message';
        } else {
          console.log($scope.roomId);
          messages.postMessage({
            content: this.message,
            user: username,
            roomCreator: $scope.roomId
          }).then(function(usernames) {
            console.log('save success');
          });

          socket.emit('sendMessage', {
            name: username,
            message: this.message,
            roomId: $scope.roomId
          });
          $scope.message    = '';
          $scope.error.send = '';
        }
      };

      socket.on('sendChatMessage', function(message) {
        console.log('_______________ send _____________________');
        console.log(message);
        messages.getMessagesFromRoom(message.roomId).then(function(response) {
          if (response && response.length > 0) {
            $scope.messages.push(message);
          }
        });
      });

      socket.on('updatePeopleCount', function(data) {
        $scope.peopleCount = data.count;
      });

      socket.on('listAvailableChatRooms', function(data) {
        angular.forEach(data, function(room, key) {
          $scope.rooms.push({name: room.name, id: room.id});
        });
      });
    }
]);
