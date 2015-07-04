angular.module('InTouch')
  .factory('Auth', Auth);

Auth.$inject = ['$q', '$rootScope', 'Session', 'User', '$http', 'Notifications', '$localStorage'];

function Auth($q, $rootScope, Session, User, $http, Notifications, $localStorage) {
  return {
    login: function(user, callback) {
      var cb = callback || angular.noop;
      console.log(user);

      Session.save({
          email: user.email_username,
          password: user.password
      }, function(user) {
        console.log('________________RESPONSE LOGIN____________');
        $localStorage.currentUser = user;
        $rootScope.currentUser = $localStorage.currentUser;
        var userToken = $rootScope.currentUser.token;
        $http.defaults.headers.common['auth-token'] = userToken;
        Notifications.getNotifications().then(function(response) {
          $rootScope.currentUser.notifications = response;
          $rootScope.currentUser.notificationsCount = response.length;
        });
        return cb();
      }, function(err) {
        console.log(err);
        return cb(err.data);
      });

    },

    deleteSession: function() {
      console.log('deleteSession');
      var scope = this;
      var userToken = $localStorage.currentUser.token;
      var deferred = $q.defer();
      $http.defaults.headers.common['auth-token'] = userToken;
      $http.delete('/auth/logout/').success(function(data) {
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
    },

    resetSession: function() {
      $rootScope.currentUser = null;
      $localStorage.currentUser = null;
    },

    createUser: function(userinfo, callback) {
      console.log('************createUser********************');
      var cb = callback || angular.noop;
      User.save(userinfo, function(user) {
        console.log('Create user');
        console.log(user);
        $localStorage.currentUser = user;
        $rootScope.currentUser = $localStorage.currentUser;
        return cb();
      },
      function(err) {
        return cb(err.data);
      });
    },

    currentUser: function() {
      console.log('************currentUser********************');
      Session.get(function(user) {
        $rootScope.currentUser = user;
      });
    },

    changePassword: function(email, oldPassword, newPassword, callback) {
      console.log('************changePassword********************');
      var cb = callback || angular.noop;
      User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
      }, function(user) {
        console.log('password changed');
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    },

    removeUser: function(email, password, callback) {
      console.log('****************removeUser****************');
      var cb = callback || angular.noop;
      User.delete({
          email: email,
          password: password
      }, function(user) {
        return cb();
      }, function(err) {
        return cb(err.data);
      });
    }
  };
}
