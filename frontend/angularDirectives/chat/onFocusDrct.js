/////////////////////////////////////////////////////////////////
// FOR CHAT (IS TYPING...) //////////////////////////////////////
/////////////////////////////////////////////////////////////////
angular.module('InTouch')
  .directive('onFocus', Focus);

function Focus() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      el.bind('focus', function() {
        scope.$apply(attrs.onFocus);
      });
    }
  };
}
