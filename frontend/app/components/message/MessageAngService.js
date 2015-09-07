angular.module('InTouch')
  .service('MessageService', MessageService);

MessageService.$inject = ['MessageInterface'];

function MessageService(MessageInterface) {
  this.create = function create(message, user, userRec, roomCreator) {
    return new MessageInterface(message, user, userRec, roomCreator);
  }
}
