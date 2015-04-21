angular.module('InTouch')
    .directive('checkboxList', function() {
      return {
          require: 'ngModel',
          link: function(scope, elm, attr, ngModel) {
            ngModel.$render = function() {
              var values = ngModel.$modelValue || [];
              angular.forEach(elm.find('input'), function(input) {
                var value = values.indexOf(input.getAttribute('value'));
                input.checked = value !== -1;
              });
            };

            elm.bind('click', function(e) {
              if (angular.lowercase(e.target.nodeName) === 'input') {
                scope.$apply(function() {
                  var values = [];

                  angular.forEach(elm.find('input'), function(input) {
                    if (input.checked) {
                      values.push(input.getAttribute('value'));
                    }
                  });

                  ngModel.$setViewValue(values);
                });
              }
            });
          }
      };
    });
