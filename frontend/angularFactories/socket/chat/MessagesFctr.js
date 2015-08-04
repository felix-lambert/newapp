angular.module('InTouch')

.factory('Message', Message);

Message.$inject = ['$q', '$http'];

function Message($q, $http) {

  var Message = function() {
    this._id = '';
    this._messageField = null;
    this._username = '';
  };

  Message.prototype = {
    setMessageField: setMessageField,
    postMessage: postMessage,
    getMessagesFromRoom: getMessagesFromRoom,
    deleteMessage: deleteMessage,
  };

  return Message;

  function setId(id) {
    this._id = id;
  }

  function setMessageField(content, user, userRec, roomCreator) {
    this._messageField = {
      content: content,
      user: user,
      userRec: userRec,
      roomCreator: roomCreator
    };
  }

  function postMessage() {
    var self = this;
    $http.post('/api/messages/', self._messageField)
    .then(function(response) {
      return response;
    });
  }

  function getMessagesFromRoom() {
    var self = this;
    $http.get('/api/messages/' + self._id).then(function(response) {
      return response;
    });
  }

  function deleteMessage() {
    $http.delete('/api/messages/' + self._id).then(function(response) {
      return response;
    });
  }

}
