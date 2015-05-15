angular.module('InTouch')
    .factory('Profile', ['$resource', Profile]);

function Profile($resource) {
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
}
