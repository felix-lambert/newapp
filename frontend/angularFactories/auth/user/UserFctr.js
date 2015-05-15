angular.module('InTouch')
  .factory('User', ['$resource', User]);

function User($resource) {
  console.log('**************user*****************');
  return $resource('/auth/register/:id/', {}, {
    'update': {
      method: 'PUT'
    },
    'query': {
      method: 'GET',
    }
  });
}
