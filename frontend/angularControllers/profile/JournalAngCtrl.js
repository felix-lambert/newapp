angular.module('InTouch')
  .controller('JournalAngCtrl', JournalAngCtrl);

JournalAngCtrl.$inject = ['$scope', '$rootScope', '$location', 'appLoading'];

function JournalAngCtrl($scope, $rootScope, $location, appLoading) {
  appLoading.ready();
}
