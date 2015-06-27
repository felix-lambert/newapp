angular.module('InTouch')
    .directive('compareToValidator', compareToValidator);

function compareToValidator() {
  return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        scope.$watch(attrs.compareToValidator, function() {
          console.log('test');
          ngModel.$validate();
        });
        ngModel.$validators.compareTo = function(value) {
          console.log(value);
          console.log(attrs.compareToValidator);
          var other = scope.$eval(attrs.compareToValidator);
          return !value || !other || value == other;
        };
      }
    };
}
