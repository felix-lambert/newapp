angular.module('InTouch')
    .factory('Profile', ['$resource', function($resource) {
      console.log('**************profile*****************');
      return $resource('/api/profile', {}, {
          'update': {
              method: 'PUT'
          },
          'query': {
              method: 'GET',
              isArray: false
          }
      });
    }]);
