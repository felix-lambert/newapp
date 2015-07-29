angular.module('InTouch')
  .controller('ActualityAngCtrl', ActualityAngCtrl);

ActualityAngCtrl.$inject = ['Actuality', 'appLoading', '$localStorage'];

function ActualityAngCtrl(Actuality, appLoading, $localStorage) {
  
  appLoading.ready();

  var vm = this;
  vm.actualities = [];
  $localStorage.searchField = null;

  // vm.like = like;
  // 
  // Like.getLikesFromUser()
  // .then(function(response) {
  //   vm.nbLikes = response.length;
  //   for (var i = 0; i < response.length; i++) {
  //     vm.likes.push({
  //       user: response[i].user
  //     });
  //   }
  // });

  // function like(actualityId, usernameDes, userDesId) {
  //   vm.suggestions = '';
  //   Notifications.postNotification({
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     type: 'like'
  //   }).then(function(response) {
  //     console.log('notifications success');
  //   });

  //   Like.postLike({
  //     id: actualityId,
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     likeType: 'actuality'
  //   }).then(function(response) {
  //     console.log('notifications success');
  //   });

  //   Actuality.getActualities().then(function(res) {
  //     console.log(res);
  //     vm.actualities = res;
  //   });
  //   console.log('toaster');
  //   toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
  //   socket.emit('sendLike', {
  //     user: $rootScope.currentUser.username,
  //     userDes: usernameDes,
  //     userDesId: userDesId,
  //     id: $rootScope.currentUser._id
  //   });
  // }

  Actuality.getActualities().then(function(res) {
    console.log(res);
    vm.actualities = res;
  });
}
