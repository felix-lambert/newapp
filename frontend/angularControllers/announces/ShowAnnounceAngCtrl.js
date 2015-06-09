angular.module('InTouch')
.controller('ShowAnnounceAngCtrl', ShowAnnounceAngCtrl);

ShowAnnounceAngCtrl.$inject = ['announces', 'Comments',
  '$routeParams', '$rootScope', 'appLoading'];

function ShowAnnounceAngCtrl(announces, Comments, $routeParams,
  $rootScope, appLoading) {

  var vm = this;

  vm.findOne          = findOne;
  vm.getComments      = getComments;
  vm.postComment      = postComment;
  vm.removeComment    = removeComment;
  vm.initViewAnnounce = initViewAnnounce;

  appLoading.ready();

  ///////////////////////////////////////////////////////////////////////////

  function findOne() {
    announces.getAnnounceById($routeParams.announceId).then(function(res) {
      console.log('announce found________');
      console.log(res);
      vm.announce = res;
      vm.announceRating = res.rating;
      vm.selectedImages = res.images;
    });
  }

  function getComments() {
    Comments.getAnnounceComments($routeParams.announceId)
    .then(function(res) {
      console.log('GET COMMENTS');
      vm.comments = res;
      console.log(vm.comments);
    });
  }

  function postComment() {

    Comments.postComment({
      content: vm.AnnounceComment,
      rating: vm.rating,
    }, $routeParams.announceId).then(function(res) {
      if (res.newRating !== null) {
        vm.announceRating = res.newRating;
      }
      vm.AnnounceComment = '';
      vm.getComments();
    });
  }

  function removeComment(comment) {
    Comments.deleteComment(comment._id).then(function(res) {
      for (var i in vm.comments) {
        if (vm.comments[i] == comment) {
          vm.comments.splice(i, 1);
        }
      }
      console.log('delete');
    });
  }

  function initViewAnnounce() {
    console.log('__AnnouncesCtrl $scope.initViewAnnounce__');
    vm.findOne();
    vm.getComments();
  }
}
