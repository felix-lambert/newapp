angular.module('InTouch')
  .service('RoomService', RoomService);

RoomService.$inject = ['RoomInterface'];

function RoomService(RoomInterface) {
  this.create = function create(user) {
    return new RoomInterface(user);
  }
}
