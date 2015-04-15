angular.module('InTouch').directive('headerAdm', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/partials/header/headerAdm.html',
  };
});
