angular.module('InTouch')

.factory('transactions', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope) {
    return $resource('/api/transactions/:id', {},
        {
        update: {
            method: 'PUT'
        }
    });
}]);