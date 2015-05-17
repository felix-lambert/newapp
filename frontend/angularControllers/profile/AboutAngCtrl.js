angular.module('InTouch')
  .controller('AboutAngCtrl', AboutAngCtrl);

AboutAngCtrl.$inject = ['$scope', '$rootScope', '$location', 'appLoading'];

function AboutAngCtrl($scope, $rootScope, $location, appLoading) {
  appLoading.ready();
}
