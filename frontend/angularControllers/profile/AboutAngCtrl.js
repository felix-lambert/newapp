angular.module('InTouch')
  .controller('AboutAngCtrl', AboutAngCtrl);

AboutAngCtrl.$inject = ['$rootScope', '$location', 'appLoading'];

function AboutAngCtrl($rootScope, $location, appLoading) {
  appLoading.ready();
}
