angular.module('InTouch')
    .factory('Session', ['$resource', function($resource) {
      console.log('*************session----------********************');
      return $resource('/auth/login');
    }]);
