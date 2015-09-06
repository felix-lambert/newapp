angular.module('InTouch')
  .service('AnnounceService', AnnounceService);

AnnounceService.$inject = ['AnnounceInterface'];

function AnnounceService(AnnounceInterface) {
  this.create = function create(title, content, type, category, price, selectedImages, activated, tags) {
    return new AnnounceInterface(title, content, type, category, price, selectedImages, activated, tags);
  }
}
