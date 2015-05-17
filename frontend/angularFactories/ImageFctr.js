angular.module('InTouch')

.factory('Images', Images);

Images.$inject = ['$q', '$http'];

function Images($q, $http) {

  var imagesFnct = {
    getImages: getImages
  };

  return imagesFnct;

  function getImages() {
    var deferred = $q.defer();
    $http.get('/api/images/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }
}
