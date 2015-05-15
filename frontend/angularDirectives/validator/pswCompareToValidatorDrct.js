angular.module('InTouch')
    .directive('compareToValidator', compareToValidator);

function compareToValidator() {
  return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(attrs.compareToValidator, function() {
          ngModel.$validate();
        });
        ngModel.$validators.compareTo = function(value) {
          var other = scope.$eval(attrs.compareToValidator);
          return !value || !other || value == other;
        };
      }
    };
}
