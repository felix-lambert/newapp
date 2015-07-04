angular.module('InTouch')
  .directive('autoComplete', autoComplete);

function autoComplete() {
  return {
      restrict: 'AE',
      scope: {
          selectedTags: '=model'
      },
      templateUrl: 'views/templates/userFilterTemplate.html',
      link:function(scope, elem, attrs) {

        scope.suggestions   = [];
        scope.selectedTags  = [];
        scope.selectedIndex = -1;

        scope.removeTag = function(index) {
          scope.selectedTags.splice(index, 1);
        };

        scope.search = function() {

          scope.selectedIndex = -1;
        };

        scope.addToSelectedTags = function(index) {
          console.log('addToSelectedTags');
          if (scope.selectedTags.indexOf(scope.suggestions[index]) === -1) {
            scope.selectedTags.push(scope.suggestions[index]);
            scope.searchText  = '';
            scope.suggestions = [];
          }
        };

        scope.checkKeyDown = function(event) {
          console.log('checkkeydown');
          if (event.keyCode === 40) {
            event.preventDefault();
            if (scope.selectedIndex + 1 !== scope.suggestions.length) {
              scope.selectedIndex++;
            }
          } else if (event.keyCode === 38) {
            event.preventDefault();
            if (scope.selectedIndex - 1 !== -1) {
              scope.selectedIndex--;
            }
          } else if (event.keyCode === 13) {
            scope.addToSelectedTags(scope.selectedIndex);
          }
        };

        scope.$watch('selectedIndex', function(val) {
          console.log('selectedIndex');
          console.log('ùùùùùùùùùùùùùùùùùùùùùùùùùùùù');
          console.log(val);
          if (val !== -1) {
            console.log(scope.suggestions[scope.selectedIndex]);
            scope.searchText = scope.suggestions[scope.selectedIndex];
            console.log(scope.searchText);
          }
        });
      }
  };
}
