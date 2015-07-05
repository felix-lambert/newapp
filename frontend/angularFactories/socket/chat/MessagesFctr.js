angular.module('InTouch')

.factory('Messages', Messages);

Messages.$inject = ['$q', '$http'];

function Messages($q, $http) {

  var messagesFnct = {
    postMessage: postMessage,
    getMessagesFromRoom: getMessagesFromRoom,
    deleteMessage: deleteMessage,
    getMessagesFromUser: getMessagesFromUser
  };

  return messagesFnct;

  function postMessage(message) {
    var deferred = $q.defer();
    $http.post('/api/messages/', message).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getMessagesFromUser(username) {
    var deferred = $q.defer();
    $http.get('/api/messages/user/' + username).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getMessagesFromRoom(id) {
    var deferred = $q.defer();
    $http.get('/api/messages/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteMessage(id) {
    var deferred = $q.defer();
    $http.delete('/api/messages/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

}
