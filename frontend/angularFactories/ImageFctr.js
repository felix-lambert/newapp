angular.module('InTouch').factory('Image', Image);

Image.$inject = ['$q', '$http', '$rootScope'];

function Image($q, $http, $rootScope) {

  var Image = function() {
    this._id = '';
    this._actuality = '';
    this._imageName = '';
    this._imageField = null;
    this._images = null;
    this._image = null;
    this._defaultImage = '';
  };

  Image.prototype = {
    setId: setId,
    deleteImage: deleteImage,
    getImages: getImages,
    changeImageStatus: changeImageStatus
  };

  return Image;

  function setId(id) {
    this._id = id;
  }

  function setImage() {
    this._imageName = imageName;
    this._defaultImage = defaultImage;
  }

  function getImages() {
    var self = this;
    $http.get('/api/images/')
    .then(function(response) {
      this._images = response.data;
      return response;
    });
  }

  function deleteImage() {
    var self = this;
    $http.delete('/api/images/' + self._id)
    .then(function(response) {
      return response;
    });
  }

  function changeImageStatus() {
    $http.put('/api/images/' + this._imageName + '/' + this._id + '/' + this._defaultImage)
    .then(function(response) {
      this._image = response.data;
      return response;
    });
  }
}
