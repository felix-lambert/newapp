angular.module('InTouch')

.factory('Announce', Announce);

Announce.$inject = ['$q', '$http'];

function Announce($q, $http) {


  var announcesFnct = {
    postAnnounce: postAnnounce,
    getAnnouncesPerPage: getAnnouncesPerPage,
    getAnnounces: getAnnounces,
    getAnnouncesFromUser: getAnnouncesFromUser,
    getAnnounceById: getAnnounceById,
    deleteAnnounce: deleteAnnounce,
    putAnnounce: putAnnounce,
    statusAnnounce: statusAnnounce,
    searchAnnounces: searchAnnounces,
    pressSearchAnnounces: pressSearchAnnounces
  };

  return announcesFnct;

  function postAnnounce(announce) {
    var deferred = $q.defer();
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

  function searchAnnounces(res) {
    var deferred = $q.defer();
    $http.get('api/searchannounces/' + res.term + '/' + res.page)
      .success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
    return deferred.promise;
  }

  function pressSearchAnnounces(term) {
    var deferred = $q.defer();
    $http.post('api/searchannounces/', term)
      .success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
    return deferred.promise;
  }


  function getAnnounces(announce) {
    var deferred = $q.defer();
    $http.get('/api/announces/' + announce.page + '/' + announce.limit).success(function(data) {
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
    $http.put('/api/announces/' + announce._id + '/' + announce.content + '/' + announce.title)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function statusAnnounce(announce) {
    console.log(announce);
    var deferred = $q.defer();
    $http.put('/api/statusannounce/' + announce._id + '/' +
      announce.activated).success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
    return deferred.promise;
  }
}
