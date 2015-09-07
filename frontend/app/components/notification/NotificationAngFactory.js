angular.module('InTouch')

.factory('Notification', Notification);

Notification.$inject = ['$http'];

function Notification($http) {

  var Notification = function() {
    this._id = '';
    this._notification = '';
    this._notificationField = null;
    this._notifications = null;
  };

  Notification.prototype = {
    setId: setId,
    setField: setField,
    postNotification: postNotification,
    getNotifications: getNotifications,
    deleteNotification: deleteNotification
  };

  return Notification;

  function setId(id) {
    this._id = id;
  }

  function setField(userDes, userDesId, type) {
    this._notificationField = {
      userDes: userDes,
      userDesId: userDesId,
      type: type
    };
  }

  function postNotification() {
    var self = this;
    return $http.post('/api/notifications/', self._notificationField)
    .then(function(response) {
      return response;
    });
  }

  function getNotifications() {
    var self = this;
    return $http.get('/api/notifications/')
    .then(function(response) {
      console.log(response.data);
      self._notifications = response.data;
      return response;
    });
  }

  function deleteNotification() {
    var self = this;
    return $http.delete('/api/notifications/' + self._id)
    .then(function(response) {
      return response;
    });
  }
}
