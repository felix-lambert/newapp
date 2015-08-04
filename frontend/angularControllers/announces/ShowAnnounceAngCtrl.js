angular.module('InTouch')
.controller('ShowAnnounceAngCtrl', ShowAnnounceAngCtrl);

ShowAnnounceAngCtrl.$inject = ['$injector', '$routeParams', '$rootScope', '$localStorage'];

function ShowAnnounceAngCtrl($injector, $routeParams, $rootScope, $localStorage) {
  
  var vm              = this;
  
  var socket          = $injector.get('socket');
  var Announce        = $injector.get('Announce');
  var toaster         = $injector.get('toaster');
  var appLoading      = $injector.get('appLoading');
  var Friend         = $injector.get('Friend');
  var Comment        = $injector.get('Comment');
  
  vm.findOne          = findOne;
  vm.getComments      = getComments;
  vm.postComment      = postComment;
  vm.removeComment    = removeComment;
  vm.initViewAnnounce = initViewAnnounce;
  // vm.followUser       = followUser;
  vm.testIfFriend     = testIfFriend;
  vm.countFriends     = countFriends;

  appLoading.ready();

  $localStorage.searchField = null;

  var announce = new Announce();
  var comment  = new Comment();
  var friend = new Friend();

  ///////////////////////////////////////////////////////////////////////////

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

  function findOne() {
    announce.setId($routeParams.announceId);
    announce.getAnnounceById().then(function() {
      console.log('announce found________');
      vm.announce = announce._announce;
      console.log(vm.announce);
      vm.testIfFriend(vm.announce);
      vm.countFriends(vm.announce);
      vm.announceRating = announce._announce.rating;
      vm.selectedImages = announce._announce.images;
    });
  }

  // function followUser(userDes, idUser) {
  //   console.log('_____follow_____');
  //   console.log(idUser);
  //   vm.suggestions = '';
  //   Friends.postFriend({
  //     usernameWaitFriendRequest: userDes,
  //     idUser: idUser
  //   }).then(function(response) {
  //     console.log('friend request done');
  //   });
  //   console.log('toaster');
  //   toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
  //   if ($rootScope.currentUser) {
  //     socket.emit('sendFriendRequest', {
  //       user: $rootScope.currentUser.username,
  //       userDes: userDes,
  //       userDesId: idUser,
  //       id: $rootScope.currentUser._id
  //     });

  //     vm.followStatus = 2;
  //   }
  // }

  function getComments() {

    comment.setId($routeParams.announceId);
    comment.getAnnounceComments()
    .then(function() {
      console.log('GET COMMENTS');
      vm.comments = comment.commments;
      console.log(vm.comments);
    });
  }

  function postComment() {
    comment.setField(vm.AnnounceComment);
    comment.postComment().then(function() {
      vm.AnnounceComment = '';
      vm.getComments();
    });
  }

  function removeComment(comment) {
    comment.setId(comment._id);
    Comments.deleteComment().then(function() {
      for (var i in vm.comments) {
        if (vm.comments[i] == comment.comment) {
          vm.comments.splice(i, 1);
        }
      }
    });
  }

  function initViewAnnounce() {
    console.log('__AnnouncesCtrl $scope.initViewAnnounce__');
    vm.findOne();
    vm.getComments();
  }
}
