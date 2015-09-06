angular.module('InTouch').filter('cutFilter', cutFilter);

function cutFilter() {
  return function(input) {
    if (input.length > 18) {
      return input.substr(0, 19) + '...';
    }
    return input;
  };
}