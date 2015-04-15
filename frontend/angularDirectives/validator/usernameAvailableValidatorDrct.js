angular.module('InTouch')
    .directive('usernameAvailableValidator', ['$http', function($http) {
        return {
            require: 'ngModel',
            link: function($scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.usernameAvailable = function(username) {
                    console.log('usernameAvailableValidator');
                    return $http.get('/auth/username-exists?u=' + username);
                };
            }
        };
    }]);