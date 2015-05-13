angular.module('InTouch').directive('mySelect', function($parse) {
 return function($scope, $element, $attrs) {
      var modelAccessor = $parse(attrs.ngModel);
      console.log('inside my select');
      var mySelect = $element('#first-disabled2');

      $element('#special').on('click', function() {
        mySelect.find('option:selected').attr('disabled', 'disabled');
        mySelect.selectpicker('refresh');
      });

      var $basic2 = $element('#basic2').selectpicker({
        liveSearch: true,
        maxOptions: 1
      });

    }
  });
