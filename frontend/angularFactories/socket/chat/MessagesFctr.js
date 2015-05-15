angular.module('InTouch')

.factory('messages', ['$q', '$http', messages]);

function messages($q, $http) {
  function postMessage(message) {
    var deferred = $q.defer();
    $http.post('/api/messages/', message).success(function(data) {
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

  return {
    postMessage: postMessage,
    getMessagesFromRoom: getMessagesFromRoom,
    deleteMessage: deleteMessage
  };

  // return $resource('/api/messages/:messageId', {
  //     messageId: '@_id'
  // });
}
