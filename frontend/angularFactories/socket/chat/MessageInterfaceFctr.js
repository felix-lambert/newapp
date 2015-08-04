MessageInterface.$inject = ['$http', 'Message', '$rootScope', 'Notification', 'Session', '$localStorage'];

function MessageInterface($http, Message, $rootScope, Notification, Session, $localStorage) {
  
  var MessageInterface = function() {
    Message.apply(this, arguments);
  };

  MessageInterface.prototype = Object.create(Message.prototype);
  MessageInterface.prototype.constuctor = MessageInterface;

  MessageInterface.prototype.postMessageAndSendSocket =  function() {

    var message = Message.prototype.postMessage.apply(this, arguments);

    var self = this;
    return message.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return sendMessageSockets.call(self);
    });
  }

  return MessageInterface;

  function sendMessageSockets() {
    console.log('get messages from room');
    var self  this;
    console.log('save success');
    socket.emit('sendMessage', {
      name: self._username,
      message: self._message,
      roomId: self._roomId
    });
    return ;
  }
}
