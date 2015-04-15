angular.module('InTouch')
    .filter('cutFilter', function() {
        return function(input) {
            if (input.length > 150)
                return input.substr(0, 150) + "...";
            return input;
        };
    });