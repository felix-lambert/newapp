angular.module('InTouch')

.factory('AnnounceManager', AnnounceManager);

Announce.$inject = ['$http'];

function AnnounceManager($http) {

  var announceManager = {
    _pool : {},
    _retrieveInstance: retrieveInstance,
    _search: search,
    _load: load,
    getAnnounceById: getAnnounceById,
    loadAllAnnounces: loadAllAnnounces,
    getAnnouncesFromUser: getAnnouncesFromUser,
    setAnnounce: setAnnounce,
    searchAnnounces: searchAnnounces,
    postAnnounce: postAnnounce
  };

  return announceManager;
  

  function retrieveInstance(announceId, announceData) {

    var instance = this._pool[announceId];
    if (instance) {
      instance.setData(announceData);
    } else {
      instance = new Announce(annnounceData);
      this._pool[announcesId] = instance;
    }
    return instance;
  }

  function search(announceId) {
    return this._pool[announceId];
  }

  function load(page, size, deferred) {
    var self = this;
    $http.get('/api/announces/' + page + '/' + size).success(function(announcesData) {
      var announces = self._retrieveInstance(announcesData.data);
      deferred.resolve(announces);
    }).error(function () {
      deferred.reject();
    });
  }

  function getAnnounceById(announceId) {
    var deferred = $q.defer();
    var announce = this._search(announceId);
    if (announce) {
      deferred.resolve(announce);
    } else {
      this._load(announceId, deferred);
    }
    return deferred.promise;
  }

  function postAnnounce(announce) { 
    var deferred = $q.defer();
    $http.post('/api/announces/', announce).success(function(result) {
      deferred.resolve(result);
    }).error(function {
      deferred.reject();
    });
  }

  function loadAllAnnounces(page, size) {
    var deferred = $q.defer();
    var self = this;
    $http.get('/api/announces/' + page + '/' + size)
    .success(function(announcesArray) {
      var announces = [];
      announcesArray.forEach(function(announceData) {
        if (announceData.title.length > 34) {
          announceData.title = announceData.title.substring(0, 35) + '...';
        }
        if (announceData.content.length > 34) {
          console.log(announceData.content.length);
          announceData.content = announceData.content.substring(0, 35) + '...';
        }
        var announce = self._retrieveInstance(announceData.id, announceData);
        announces.push(announce);
      });
      deferred.resolve(announces);
    })
    .error(function() {
        deferred.reject();
    });
    return deferred.promise;
  }

  function getAnnouncesFromUser(page, size) {
    var deferred = $q.defer();
    var self = this;
    $http.get('/api/userannounces/' + page + '/' + size)
    .success(function(announcesArray) {
      var announces = [];
      announcesArray.forEach(function(announceData) {
        if (announceData.title.length > 34) {
          announceData.title = announceData.title.substring(0, 35) + '...';
        }
        if (announceData.content.length > 34) {
          console.log(announceData.content.length);
          announceData.content = announceData.content.substring(0, 35) + '...';
        }
        var announce = self._retrieveInstance(announceData.id, announceData);
        announces.push(announce);
      });
      deferred.resolve(announces);
    })
    .error(function() {
        deferred.reject();
    });
    return deferred.promise;
  }

  function searchAnnounces(announceSearch) {
    var deferred = $q.defer();
    var self = this;
    $http.get('/api/userannounces/' + announceSearch.term + '/' + announceSearch.page)
    .success(function(announcesArray) {
      var announces = [];
      announcesArray.forEach(function(announceData) {
        if (announceData.title.length > 34) {
          announceData.title = announceData.title.substring(0, 35) + '...';
        }
        if (announceData.content.length > 34) {
          console.log(announceData.content.length);
          announceData.content = announceData.content.substring(0, 35) + '...';
        }
        var announce = self._retrieveInstance(announceData.id, announceData);
        announces.push(announce);
      });
      deferred.resolve(announces);
    })
    .error(function() {
        deferred.reject();
    });
    return deferred.promise;
  }

  function setAnnounce(announceData) {
    var self = this;
    var self = this._search(announceData.id);
    if (announce) {
      announce.setData(announceData);
    } else {
      announce = self._retrieveInstance(announceData);
    }
    return announce;
  }
}

  // var announcesFnct = {
  //   postAnnounce: Announce.postAnnounce,
  //   getAnnouncesPerPage: Announce.getAnnouncesPerPage,
  //   getAnnounces: Announce.getAnnounces,
  //   getAnnouncesFromUser: Announce.getAnnouncesFromUser,
  //   getAnnounceById: Announce.getAnnounceById,
  //   deleteAnnounce: Announce.deleteAnnounce,
  //   putAnnounce: Announce.putAnnounce,
  //   statusAnnounce: Announce.statusAnnounce,
  //   searchAnnounces: Announce.searchAnnounces,
  //   pressSearchAnnounces: Announce.pressSearchAnnounces
  // };

  // return announcesFnct;

  // function postAnnounce(announce) {
  //   var deferred = $q.defer();
  //   $http.post('/api/announces/', announce).success(function(data) {
  //     deferred.resolve(data);
  //   }).error(function() {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // }

  // function getAnnouncesPerPage(page, perpage, sort) {
  //   var deferred = $q.defer();
  //   $http.get('api/announces/list/' + page + '/' + perpage + '/' + sort)
  //     .success(function(data) {
  //       deferred.resolve(data);
  //     }).error(function() {
  //       deferred.reject();
  //     });
  //   return deferred.promise;
  // }

  // function searchAnnounces(res) {
  //   var deferred = $q.defer();
  //   $http.get('api/searchannounces/' + res.term + '/' + res.page)
  //     .success(function(data) {
  //       deferred.resolve(data);
  //     }).error(function() {
  //       deferred.reject();
  //     });
  //   return deferred.promise;
  // }

  // function pressSearchAnnounces(term) {
  //   var deferred = $q.defer();
  //   $http.post('api/searchannounces/', term)
  //     .success(function(data) {
  //       deferred.resolve(data);
  //     }).error(function() {
  //       deferred.reject();
  //     });
  //   return deferred.promise;
  // }


  // 

  // function getAnnouncesFromUser() {
  //   var deferred = $q.defer();
  //   $http.get('/api/userannounces/' + this.page + '/' + this.limit)
  //   .success(function(data) {
  //     deferred.resolve(data);
  //   }).error(function() {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // }

  // function getAnnounceById(id) {
  //   var deferred = $q.defer();
  //   $http.get('/api/announces/' + id).success(function(data) {
  //     deferred.resolve(data);
  //   }).error(function() {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // }

  // function deleteAnnounce(id) {
  //   var deferred = $q.defer();
  //   $http.delete('/api/announces/' + id).success(function(data) {
  //     deferred.resolve(data);
  //   }).error(function() {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // }

  // function putAnnounce(announce) {
  //   var deferred = $q.defer();
  //   $http.put('/api/announces/' + announce._id + '/' + announce.content + '/' + announce.title)
  //   .success(function(data) {
  //     deferred.resolve(data);
  //   }).error(function() {
  //     deferred.reject();
  //   });
  //   return deferred.promise;
  // }

  // function statusAnnounce(announce) {
  //   console.log(announce);
  //   var deferred = $q.defer();
  //   $http.put('/api/statusannounce/' + announce._id + '/' +
  //     announce.activated).success(function(data) {
  //       deferred.resolve(data);
  //     }).error(function() {
  //       deferred.reject();
  //     });
  //   return deferred.promise;
  // }
// }