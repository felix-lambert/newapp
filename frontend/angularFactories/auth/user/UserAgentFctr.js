angular.module('InTouch')
    .factory('useragent', ['$q', '$rootScope', '$window', 'useragentmsgs',
      function($q, $rootScope, $window, useragentmsgs) {
        return {
            getUserAgent: function() {
              var deferred = $q.defer();
              if ($window.navigator && $window.navigator.userAgent) {
                var ua = $window.navigator.userAgent;
                deferred.resolve(ua);
              } else {
                $rootScope.$broadcast('error',
                  useragentmsgs['errors.useragent.notFound']);
                $rootScope.$apply(function() {
                  deferred.reject(useragentmsgs['errors.useragent.notFound']);
                });
              }
              return deferred.promise;
            },
            getIcon: function(ua) {
              var deferred = $q.defer();
              var icon = '';
              if (ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                icon = 'mobile';
                deferred.resolve(icon);
              } else {
                icon = 'desktop';
                deferred.resolve(icon);
              }
              return deferred.promise;
            }
        };

      }]);
