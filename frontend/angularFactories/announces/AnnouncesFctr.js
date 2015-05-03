angular.module('InTouch')

.factory('announces', ['$q', '$http', function($q, $http) {

  function postAnnounce(announce) {
    var deferred = $q.defer();
    console.log('post annonce');
    $http.post('/api/announces/', announce).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getAnnouncesPerPage(page, perpage, sort) {
    var deferred = $q.defer();
    $http.get('api/announces/list/' + page + '/' + perpage + '/' + sort)
      .success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
    return deferred.promise;
  }

  function getAnnounces() {
    var deferred = $q.defer();
    $http.get('/api/announces/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getAnnouncesFromUser(id) {
    var deferred = $q.defer();
    $http.get('/api/announces/' + id.page + '/' + id.limit  + '/' + id.user)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getAnnounceById(id) {
    var deferred = $q.defer();
    $http.get('/api/announces/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteAnnounce(id) {
    var deferred = $q.defer();
    $http.delete('/api/announces/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function putAnnounce(announce) {
    var deferred = $q.defer();
    $http.put('/api/announces/' + announce._id, announce)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  return {
    postAnnounce: postAnnounce,
    getAnnouncesPerPage: getAnnouncesPerPage,
    getAnnounces: getAnnounces,
    getAnnouncesFromUser: getAnnouncesFromUser,
    getAnnounceById: getAnnounceById,
    deleteAnnounce: deleteAnnounce,
    putAnnounce: putAnnounce
  };
}]);
