angular.module('InTouch')
  .factory('ImageInterface', ImageInterface);

ImageInterface.$inject = ['$http', 'Image', '$rootScope', 'Notification', 'Session', '$localStorage'];

function ImageInterface($http, Image, $rootScope, Notification, Session, $localStorage) {
  
  var ImageInterface = function() {
    Image.prototype.setImage.apply(this, arguments);
  };

  ImageInterface.prototype = Object.create(Image.prototype);
  ImageInterface.prototype.constuctor = ImageInterface;

  ImageInterface.prototype.putImage =  function() {

    var image = Image.prototype.changeStatus.apply(this, arguments);

    var self = this;
    return image.then(function() {
      // before returning the result,
      // call our new private method and bind "this" to "self"
      // we need to do this because the method is not part of the prototype
      return getImages.call(self);
    });

  }

  return ImageInterface;

  function getImages() {
    $http.defaults.headers.common['auth-token'] = $rootScope.currentUser.token;
    var self = this;
    return $http.get('/api/images/')
    .then(function(response) {
      console.log(response.data);
      self._images = response.data;
      return response;
    });
  }
}
