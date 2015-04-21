angular.module('InTouch')
    .factory('Auth', ['$localStorage', '$rootScope',
      'Session', 'User', '$http', 'notifications',
        function($localStorage, $rootScope,
          Session, User, $http, notifications) {

          return {
            login: function(provider, user, callback) {
              var cb = callback || angular.noop;
              console.log(user);
              Session.save({
                  email: user.email,
                  password: user.password
              }, function(user) {
                console.log('________________RESPONSE LOGIN____________');
                $localStorage.currentUser = user;
                $rootScope.currentUser = $localStorage.currentUser;
                var userToken = $rootScope.currentUser.token;
                $http.defaults.headers.common['auth-token'] = userToken;
                notifications.getNotifications().then(function(response) {
                  console.log(response);
                  console.log(response.length);
                  $rootScope.currentUser.notifications = response;
                  $rootScope.currentUser.i = response.length;
                });
                return cb();
              }, function(err) {
                return cb(err.data);
              });
            },

            logout: function(callback) {
              var scope = this;
              var cb = callback || angular.noop;
              var userToken = $localStorage.currentUser.token;
              $http.defaults.headers.common['auth-token'] = userToken;
              Session.delete(function(res) {
                console.log('delete');
                scope.resetSession();
                return cb();
              },
              function(err) {
                return cb(err.data);
              });
            },

            resetSession: function() {
              $rootScope.currentUser = null;
              $localStorage.currentUser = null;
              delete $localStorage;
            },

            createUser: function(userinfo, callback) {
              console.log('************createUser********************');
              var cb = callback || angular.noop;
              User.save(userinfo, function(user) {
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
]);
