angular.module('InTouch')
  .service('RoomService', RoomService);

RoomService.$inject = ['RoomInterface'];

function RoomService(RoomInterface) {
  this.create = function create(user) {
  	console.log('________________________________room service_______________');

    return new RoomInterface(user);
  }
}
