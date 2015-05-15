angular.module('InTouch')
    .factory('Session', ['$resource', Session]);

function Session($resource) {
  console.log('*************session----------********************');
  return $resource('/auth/login');
}
