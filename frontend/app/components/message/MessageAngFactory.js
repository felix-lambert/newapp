angular.module('InTouch')

.factory('Message', Message);

Message.$inject = ['$http'];

function Message($http) {

  var Message = function() {
    this._id = '';
    this._messageField = null;
    this._username = '';
    this._messages = null;
  };
  
  Message.prototype = {
    setId: setId,
    setField: setField,
    postMessage: postMessage,
    getMessagesFromRoom: getMessagesFromRoom,
    deleteMessage: deleteMessage,
  };

  return Message;

  function setId(id) {
    this._id = id;
  }

  function setField(content, user, userRec, roomCreator) {
    this._messageField = {
      content: content,
      user: user,
      userRec: userRec,
      roomCreator: roomCreator
    };
  }

  function postMessage() {
    var self = this;
    return $http.post('/api/messages/', self._messageField)
    .then(function(response) {
      return response;
    });
  }

  function getMessagesFromRoom() {
    var self = this;
    return $http.get('/api/messages/' + self._id).then(function(response) {
      self._messages = response.data;
      return response;
    });
  }

  function deleteMessage() {
    var self = this;
    return $http.delete('/api/messages/' + self._id).then(function(response) {
      return response;
    });
  }

}
