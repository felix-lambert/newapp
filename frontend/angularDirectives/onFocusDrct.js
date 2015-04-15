angular.module('InTouch')
  .directive('onFocus', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
          el.bind('focus', function() {
            scope.$apply(attrs.onFocus);
          });
        }
    };
  });
