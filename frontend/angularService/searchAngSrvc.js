angular.module('InTouch')
  .service('SearchService', SearchService);

RoomService.$inject = ['SearchInterface'];

function SearchService(SearchInterface) {
  this.search = function search(search) {
    return new SearchInterface(search);
  }
}
