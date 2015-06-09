angular.module('InTouch')
    .controller('AboutModalAngCtrl', AboutModalAngCtrl);

AboutModalAngCtrl.$inject = ['$modalInstance'];

function AboutModalAngCtrl($modalInstance) {

  var vm = this;

  vm.cancel = cancel;

  //////////////////////////////////////////////////////////

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
