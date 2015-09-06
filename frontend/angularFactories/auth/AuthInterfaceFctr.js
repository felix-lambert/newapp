angular.module('InTouch')
  .factory('AuthInterface', AuthInterface);

AuthInterface.$inject = ['appLoading', '$http', 'Auth', '$rootScope', 'Notification', '$localStorage'];

function AuthInterface(appLoading, $http, Auth, $rootScope, Notification, $localStorage) {
  
  var AuthInterface = function() {
    Auth.prototype.setLoginField.apply(this, arguments);
  };

  AuthInterface.prototype = Object.create(Auth.prototype);
  AuthInterface.prototype.constuctor = AuthInterface;

  AuthInterface.prototype.getProfile =  function() {

    var originalGetProfile = Auth.prototype.login.apply(this, arguments);

    var self = this;
    return originalGetProfile.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return getUserEvents.call(self);
    });

  }

  function getUserEvents() {
    console.log('get user events');
    var self = this;
    console.log(self._error);
    if (!self._error) {
      $localStorage.currentUser = self._profile;
      $rootScope.currentUser = $localStorage.currentUser;
      $http.defaults.headers.common['auth-token'] = self._profile.token;
      var notification = new Notification();
      notification.getNotifications().then(function() {
        console.log('get notification');
        $rootScope.currentUser.notifications      = notification._notifications;
        $rootScope.currentUser.notificationsCount = notification._notifications.length;
        appLoading.ready();
      });
    }
  }

  return AuthInterface;


}
