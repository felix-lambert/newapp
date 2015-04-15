angular.module('InTouch')

.factory('rooms', ['$q', '$http', function($q, $http) {

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

  return {
    postRoom: postRoom,
    getRooms: getRooms,
    deleteRoom: deleteRoom
  };

  // return $resource('/api/rooms/:roomId', {
  //   roomId: '@_id'
  // }, {
  //   'save': {
  //     method: 'POST',
  //     isArray: false
  //   },

  // });
}]);
