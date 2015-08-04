angular.module('InTouch')
.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();
  if (socket.connected === false) {
    $rootScope.status = 'offline';
  }

  var disconnect = false;

  return {
    on: function(eventName, callback) {
      console.log('socket on');
      socket.on(eventName, function() {
        var args = arguments;
        if (!disconnect) {
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        }
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    disconnect: function() {
      disconnect = true;
      socket.disconnect();
    }
  };

}]);
