angular.module('InTouch')
    .directive('usernameAvailableValidator', usernameAvailableValidator);

usernameAvailableValidator.$inject = ['$http'];

function usernameAvailableValidator($http) {
  return {
    require: 'ngModel',
    link: function($scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.usernameAvailable = function(username) {
        console.log('usernameAvailableValidator');
        return $http.get('/auth/username-exists?u=' + username);
      };
    }
  };
}
