angular.module('InTouch')
.factory('notificationSrvc', ['notifications',
  function(notifications) {
    var newNotifs = [];

    function getNotification() {
      console.log('getElementsByTagName');
      return newNotifs;
    }

    function addNotification(newNotifs) {
      newNotifs.push(notifs);
    }
    return {
      get: getNotification,
      add: addNotification
    };
  }]);
