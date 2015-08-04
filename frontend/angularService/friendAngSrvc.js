angular.module('InTouch')
  .service('FriendService', FriendService);

FriendService.$inject = ['FriendInterface'];

function FriendService(FriendInterface) {
  this.follow = function follow(usernameWaitFriendRequest, userId) {
    return new FriendInterface(usernameWaitFriendRequest, userId);
  }
}
