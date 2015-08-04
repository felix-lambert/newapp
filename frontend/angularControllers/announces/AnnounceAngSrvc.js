angular.module('InTouch')
  .factory('AnnounceService', AnnounceService);

AuthService.$inject = ['AnnounceInterface'];

function AnnounceService(AnnounceInterface) {
  this.create = function create(title, content, type, category, price, selectedImages, active, tags) {
    return new AnnounceInterface(title, content, type, category, price, selectedImages, active, tags);
  }
}
