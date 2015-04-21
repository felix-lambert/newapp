/////////////////////////////////////////////////////////////////
// ALSO FOR CHAT (IS TYPING...) /////////////////////////////////
/////////////////////////////////////////////////////////////////
angular.module('InTouch')
  .directive('onBlur', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
          el.bind('blur', function() {
            scope.$apply(attrs.onBlur);
          });
        }
    };
  });
