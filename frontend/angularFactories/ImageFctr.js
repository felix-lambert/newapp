angular.module('InTouch').factory('Image', Image);

Image.$inject = ['$http', '$rootScope'];

function Image($http, $rootScope) {

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
    changeStatus: changeStatus,
    setImage: setImage
  };

  return Image;

  function setId(id) {
    this._id = id;
  }

  function setImage(imageName, id, defaultImage) {
    this._imageName = imageName;
    this._defaultImage = defaultImage;
    this._id = id;
  }

  function getImages() {
    var self = this;
    if ($rootScope.currentUser) {
      var userToken                               = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    return $http.get('/api/images/')
    .then(function(response) {
      this._images = response.data;
      return response.data;
    });
  }

  function deleteImage() {
    var self = this;
    return $http.delete('/api/images/' + self._id)
    .then(function(response) {
      return response;
    });
  }

  function changeStatus() {
    var self = this;
    return $http.put('/api/images/' + this._imageName + '/' + this._id + '/' + this._defaultImage)
    .then(function(response) {
      self._image = response.data;
      return response;
    });
  }
}
