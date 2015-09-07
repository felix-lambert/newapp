angular.module('InTouch')
  .factory('MessageInterface', MessageInterface);

MessageInterface.$inject = ['socket', '$http', 'Message'];

function MessageInterface(socket, $http, Message) {
  
  var MessageInterface = function() {
    Message.prototype.setField.apply(this, arguments);
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
    var self = this;
    console.log(self)
    socket.emit('sendMessage', {
      name: self._messageField.user,
      message: self._messageField.content
    });
  }
}
