angular.module('InTouch')
  .factory('NotificationInterface', NotificationInterface);

NotificationInterface.$inject = ['Notification', '$rootScope'];

function NotificationInterface(Notification, $rootScope) {
  
  var NotificationInterface = function() {
    Notification.prototype.setId.apply(this, arguments);
  };

  NotificationInterface.prototype = Object.create(Notification.prototype);
  NotificationInterface.prototype.constuctor = NotificationInterface;

  NotificationInterface.prototype.updateNotification =  function() {

    var notification = Notification.prototype.deleteNotification.apply(this, arguments);

    var self = this;
    return notification.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return getNotifications.call(self);
    });

  }

  return NotificationInterface;

  function getNotifications() {
    var notification = new Notification();
    var self = this;
    notification.getNotifications().then(function() {
			$rootScope.currentUser.notifications      = notification._notifications;
			$rootScope.currentUser.notificationsCount = notification._notifications.length;
		});
  }
}