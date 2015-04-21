angular.module('InTouch')
    .directive('rating', function() {
      return {
          restrict: 'E',
          scope: {
              symbol: '@',
              max: '@',
              readonly: '@'
          },
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {

            attrs.max = scope.max = parseInt(scope.max || 5, 10);

            if (!attrs.symbol) {
              attrs.symbol = scope.symbol = '\u2605';
            }

            var styles = [];
            scope.styles = styles;

            scope.testx = 42;

            for (var i = 0; i < scope.max; i++) {
              styles.push({
                  'selected': false,
                  'hover': false
              });
            }

            scope.enter = function(index) {
              if (scope.readonly) {
                return;
              }
              angular.forEach(styles, function(style, i) {
                style['hover'] = i <= index;
              });
            };

            scope.leave = function(index) {
              if (scope.readonly) {
                return;
              }
              angular.forEach(styles, function(style, i) {
                style['hover'] = false;
              });
            };
            
            scope.select = function(index) {
              if (scope.readonly) {
                return;
              }
              ngModel.$setViewValue((index === null) ? null : index + 1);
              udpateSelectedStyles(index);
            };

            ngModel.$render = function() {
              udpateSelectedStyles(ngModel.$viewValue - 1);
            };

            function udpateSelectedStyles(index) {
              if (index === null) {
                index = -1;
              }
              angular.forEach(styles, function(style, i) {
                style['selected'] = i <= index;
              });
            }
          },
          template: '<ul class="rating" ng-class="{\'rating-pointer\':!readonly}">' +
              '<li ng-repeat="style in styles" ng-class="style"' +
              'ng-click="select($index)" ng-mouseenter="enter($index)"' +
              'ng-mouseleave="leave($index)">' +
              '{{symbol}}' +
              '</li>' +
              '</ul>' +
              '<a ng-hide="readonly" ng-click="select(null)">clear</a>'
      };
    });
