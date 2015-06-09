angular.module('InTouch')
  .controller('JournalAngCtrl', JournalAngCtrl);

JournalAngCtrl.$inject = ['$rootScope', '$location', 'appLoading'];

function JournalAngCtrl($rootScope, $location, appLoading) {
  appLoading.ready();
}
