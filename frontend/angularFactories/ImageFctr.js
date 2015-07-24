angular.module('InTouch').factory('Images', Images);

Images.$inject = ['$q', '$http', '$rootScope'];

function Images($q, $http, $rootScope) {

  var imagesFnct = {
    getImages: getImages,
    changeImageStatus: changeImageStatus,
    getImagesById: getImagesById,
    erase: erase
  };

  return imagesFnct;

  function getImages() {
    var userToken  = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
    var deferred = $q.defer();
    $http.get('/api/images/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function erase(id) {
    var deferred = $q.defer();
    $http.delete('/api/images/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getImagesById(id) {
    var deferred = $q.defer();
    $http.get('/api/images/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function changeImageStatus(image) {
    var deferred = $q.defer();
    $http.put('/api/images/' + image.name + '/' + image._id + '/' + image.defaultImage)
    .success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }
}
