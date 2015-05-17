angular.module('InTouch')
  .directive('emailAvailableValidator', emailAvailableValidator);

emailAvailableValidator.$inject = ['http'];

function emailAvailableValidator($http) {
  return {
    require: 'ngModel',
    link: function($scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.emailAvailable = function(email) {
        console.log('emailAvailable');
        return $http.get('/auth/email-exists?u=' + email);
      };
    }
  };
}
