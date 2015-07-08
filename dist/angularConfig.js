angular.module('InTouch').config(['$httpProvider', '$routeProvider', '$locationProvider',
  function($httpProvider, $routeProvider, $locationProvider) {

    for (var path in routeObject) {
      $routeProvider.when(path, routeObject[path]);
    }
    $routeProvider.otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);