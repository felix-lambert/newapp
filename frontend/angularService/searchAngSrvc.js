angular.module('InTouch')
  .service('SearchService', SearchService);

SearchService.$inject = ['SearchInterface'];

function SearchService(SearchInterface) {
  this.search = function search(search) {
    return new SearchInterface(search);
  }
}
