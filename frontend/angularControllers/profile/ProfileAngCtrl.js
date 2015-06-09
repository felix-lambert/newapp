angular.module('InTouch')
  .controller('ProfileAngCtrl', ProfileAngCtrl);

ProfileAngCtrl.$inject = ['$rootScope', 'Status', 'appLoading'];

function ProfileAngCtrl($rootScope, Status, appLoading) {

  var vm          = this;
  
  vm.removeStatus = removeStatus;
  vm.getStatus    = getStatus;
  vm.postStatus   = postStatus;
  vm.initStatus   = initStatus;
  
  vm.status       = [];

  appLoading.ready();

  //////////////////////////////////////////////////////////////////

  function removeStatus(status) {
    console.log(status);
    Status.removeStatus(status._id).then(function(res) {
      for (var i in vm.status) {
        if (vm.status[i] == status) {
          vm.status.splice(i, 1);
        }
      }
    });
  }

  function getStatus() {
    Status.getStatus($rootScope.currentUser._id)
    .then(function(res) {
      console.log('GET STATUS');
      console.log(res);
      vm.status = res;
    });
  }

  function postStatus() {
    if (vm.txtcomment !== '') {
      Status.postStatus({
        content: vm.txtcomment
      }, $rootScope.currentUser._id).then(function(res) {
        vm.getStatus();
        vm.txtcomment = '';
      });

    }
  }

  function initStatus() {
    console.log('__StatusCtrl__');
    vm.getStatus();
  }

}
