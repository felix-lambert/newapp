angular.module('InTouch')
    .factory('geolocation', ['$q', '$rootScope', '$window', '$http', 'geolocation_msgs', function($q, $rootScope, $window, $http, geolocation_msgs) {
      return {
          getLocation: function() {
            var deferred = $q.defer();
            if ($window.navigator && $window.navigator.geolocation) {
              $window.navigator.geolocation.getCurrentPosition(function(position) {
                $rootScope.$apply(function() {
                  deferred.resolve(position);
                });
              }, function(error) {
                $rootScope.$broadcast('error', geolocation_msgs['errors.location.notFound']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.notFound']);
                });
              });
            } else {
              $rootScope.$broadcast('error', geolocation_msgs['errors.location.unsupportedBrowser']);
              $rootScope.$apply(function() {
                deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);
              });
            }
            return deferred.promise;
          },
          getCountryCode: function(position) {
            var deferred = $q.defer();
            var countryCode = '';
            $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%3D%22' + position.coords.latitude + '%2C' + position.coords.longitude + '%22%20and%20gflags%3D%22R%22&format=json').success(function(data) {
              countryCode = data.query.results.Result.countrycode;
              deferred.resolve(countryCode);
            });
            return deferred.promise;
          }
      };
    }]);
