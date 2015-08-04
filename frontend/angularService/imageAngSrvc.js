angular.module('InTouch')
  .service('ImageService', ImageService);

ImageService.$inject = ['ImageInterface'];

function ImageService(ImageInterface) {
  this.changeStatus = function changeStatus(name, id, defaultImage) {
    return new ImageInterface(name, id, defaultImage);
  }
}
