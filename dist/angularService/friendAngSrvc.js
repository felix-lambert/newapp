angular.module('InTouch')
  .service('FriendService', FriendService);

FriendService.$inject = ['FriendInterface'];

function FriendService(FriendInterface) {
  this.sendRequest = function sendRequest(usernameFriendRequest, userId, type) {
    return new FriendInterface(usernameFriendRequest, userId, type);
  }
}
