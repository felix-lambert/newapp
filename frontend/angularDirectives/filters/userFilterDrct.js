angular.module('InTouch')
  .directive('autoComplete', ['$http',
    'socket', function($http) {
      return {
        restrict: 'AE',
        scope: {
            selectedTags: '=model'
        },
        templateUrl: 'views/templates/userFilterTemplate.html',
        link:function(scope, elem, attrs) {

          scope.suggestions = [];

          scope.selectedTags = [];

          scope.selectedIndex = -1;

          scope.removeTag = function(index) {
            scope.selectedTags.splice(index, 1);
          };

          scope.search = function() {
            scope.suggestions = [
              'Appareils',
              'Meubles',
              'Vêtements',
              'Echanges de savoirs',
              'Informatique',
              'Musique',
              'Cours de langue',
              'Photographie',
              'Production vidéo',
              'Transport',
              'Garde d\'enfants',
              'Ménage',
              'Bricolage',
              'Peinture',
              'Jardinage',
              'Expertise comptable',
              'Préparation de plats cuisiniers',
              'Aide pour la mise en place d\'un festin',
              'Soins médicaux',
              'Encadrement des activités sportives',
              'coupe de cheveux',
              'Manucure'
              ];
            scope.selectedIndex = -1;
          };

          scope.addToSelectedTags = function(index) {
            if (scope.selectedTags.indexOf(scope.suggestions[index]) === -1) {
              scope.selectedTags.push(scope.suggestions[index]);
              scope.searchText = '';
              scope.suggestions = [];
            }
          };

          scope.checkKeyDown = function(event) {
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
            if (val !== -1) {
              scope.searchText = scope.suggestions[scope.selectedIndex];
            }
          });
        }
    };
}]);
