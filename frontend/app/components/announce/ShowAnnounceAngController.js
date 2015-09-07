angular.module('InTouch')
.controller('ShowAnnounceAngCtrl', ShowAnnounceAngCtrl);

ShowAnnounceAngCtrl.$inject = ['$scope', '$injector', '$routeParams', '$rootScope', '$localStorage'];

function ShowAnnounceAngCtrl($scope, $injector, $routeParams, $rootScope, $localStorage) {
  
  var vm              = this;
  
  var socket          = $injector.get('socket');
  var Announce        = $injector.get('Announce');
  var toaster         = $injector.get('toaster');
  var appLoading      = $injector.get('appLoading');
  var Friend          = $injector.get('Friend');
  var Comment         = $injector.get('Comment');
  var preShowAnnounce = $injector.get('preShowAnnounce');
  var preShowComment  = $injector.get('preShowComment');
  
  vm.findOne          = findOne;
  vm.getComments      = getComments;
  vm.postComment      = postComment;
  vm.removeComment    = removeComment;
  vm.initViewAnnounce = initViewAnnounce;
  // vm.followUser    = followUser;
  vm.testIfFriend     = testIfFriend;
  vm.countFriends     = countFriends;

  appLoading.ready();

  $localStorage.searchField = null;

  var announce = new Announce();
  var comment  = new Comment();
  var friend = new Friend();

  ///////////////////////////////////////////////////////////////////////////

  var announce = preShowAnnounce;
  vm.announce = announce._announce;
  console.log(vm.announce);
  vm.testIfFriend(vm.announce);
  vm.countFriends(vm.announce);
  vm.announceRating = announce._announce.rating;
  vm.selectedImages = announce._announce.images;

  var comment = preShowComment;
  vm.comments = comment._comments;

  function testIfFriend(announce) {
    if ($rootScope.currentUser) {
      friend.setFriend(announce.creator.username);
      friend.testIfFriend().then(function() {
        vm.followStatus = friend._status;
        console.log(vm.followStatus);
      });
    }
  }

  function countFriends(announce) {
    friend.setId(announce.creator._id._id);
    friend.countFriend().then(function() {
      vm.nbFriend = friend._nbFriend;
    });
  }

  function getComments() {
    comment.setId($routeParams.announceId);
    comment.getAnnounceComments()
    .then(function() {
      console.log(comment._comments);
      
    });
  }

  function postComment() {
    var vm = this;
    console.log(vm);
    comment.setField(vm.AnnounceComment);
    comment.postComment().then(function() {
      vm.AnnounceComment = '';
      vm.getComments();
    });
  }

  function removeComment(com) {
    comment.setId(com._id);
    comment.deleteComment().then(function() {
      for (var i in vm.comments) {
        if (vm.comments[i]._id == comment._comment._id) {
          vm.comments.splice(i, 1);
        }
      }
    });
  }
}
