// angular.module('InTouch')
// .directive('myDatepicker', function($parse) {
//   return {
//     restrict: 'E',
//     replace: true,
//     transclude: false,
//     compile: function(element, attrs) {
//       var modelAccessor = $parse(attrs.ngModel);
//       var html = "<input type='text' id='" + attrs.id + "' >" +
//             "</input>";
//       var newElem = $(html);
//       element.replaceWith(newElem);

//       return function (scope, element, attrs, controller) {

//         var processChange = function () {
//          var date = new Date(element.datepicker("getDate"));

//           scope.$apply(function (scope) {
//             // Change bound variable
//             modelAccessor.assign(scope, date);
//           });
//         };

//         element.datepicker({
//            inline: true,
//            onClose: processChange,
//            onSelect: processChange
//         });

//         scope.$watch(modelAccessor, function (val) {
//            var date = new Date(val);
//            element.datepicker("setDate", date);
//         });
//       };
//     }
//   };
// });
  // $(document).ready(function(){ 
  //   $('#characterLeft').text('140 characters left');
  //   $('#message').keydown(function () {
  //       var max = 140;
  //       var len = $(this).val().length;
  //       if (len >= max) {
  //         $('#characterLeft').text('You have reached the limit');
  //         $('#characterLeft').addClass('red');
  //         $('#btnSubmit').addClass('disabled');
  //       } 
  //       else {
  //         var ch = max - len;
  //         $('#characterLeft').text(ch + ' characters left');
  //         $('#btnSubmit').removeClass('disabled');
  //         $('#characterLeft').removeClass('red');            
  //       }
  //   });    
  // });