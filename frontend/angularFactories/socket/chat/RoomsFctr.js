angular.module('InTouch')

.factory('Rooms', Rooms);

Rooms.$inject = ['$q', '$http'];

function Rooms($q, $http) {

  var roomsFnct = {
    postRoom: postRoom,
    getRooms: getRooms,
    deleteRoom: deleteRoom
  };

  return roomsFnct;

  function postRoom(room) {
    var deferred = $q.defer();
    $http.post('/api/rooms/', room).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getRooms() {
    console.log('get rooms');
    var deferred = $q.defer();
    $http.get('/api/rooms/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteRoom(id) {
    var deferred = $q.defer();
    $http.delete('/api/rooms/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  // return $resource('/api/rooms/:roomId', {
  //   roomId: '@_id'
  // }, {
  //   'save': {
  //     method: 'POST',
  //     isArray: false
  //   },

  // });
}
