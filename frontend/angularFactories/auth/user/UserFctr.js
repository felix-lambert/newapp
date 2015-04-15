angular.module('InTouch')
  .factory('User', ['$resource', function($resource) {
    console.log('**************user*****************');
    return $resource('/auth/register/:id/', {}, {
      'update': {
        method: 'PUT'
      },
      'query': {
        method: 'GET',
      }
    });
  }]);
