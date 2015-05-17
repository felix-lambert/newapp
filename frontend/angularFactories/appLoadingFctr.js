angular.module('InTouch')
  .factory('appLoading', appLoading);

appLoading.$inject = ['$rootScope'];

function appLoading($rootScope) {
  var timer;
  return {
    loading : function() {
      clearTimeout(timer);
      $rootScope.status = 'loading';
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    },
    ready : function(delay) {
      function ready() {
        $rootScope.status = 'ready';
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }
      }

      clearTimeout(timer);
      delay = delay === null ? 500 : false;
      if (delay) {
        timer = setTimeout(ready, delay);
      } else {
        ready();
      }
    }
  };
}