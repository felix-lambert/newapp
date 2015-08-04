angular.module('InTouch')
  .service('NotificationService', NotificationService);

NotificationService.$inject = ['NotificationInterface'];

function NotificationService(NotificationInterface) {
  this.update = function update(id) {
    return new NotificationInterface(id);
  }
}
