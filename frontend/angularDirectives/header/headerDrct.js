angular.module('InTouch').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/partials/header/headerx.html'
  };
});
