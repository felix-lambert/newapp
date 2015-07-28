angular.module('InTouch')

.factory('Notifications', Notifications);

Notifications.$inject = ['$q', '$http'];

function Notifications($q, $http) {

  var notificationsFnct = {
    postNotification: postNotification,
    getNotifications: getNotifications,
    updateNotification: updateNotification,
    deleteNotification: deleteNotification
  };

  return notificationsFnct;

  function postNotification(notification) {
    var deferred = $q.defer();
    $http.post('/api/notifications/', notification).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getNotifications() {
    var deferred = $q.defer();
    $http.get('/api/notifications/').success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function updateNotification(notification) {
    var deferred = $q.defer();
    $http.delete('/api/notifications/' + notification).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteNotification(id) {
    var deferred = $q.defer();
    $http.delete('/api/notifications/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

}
