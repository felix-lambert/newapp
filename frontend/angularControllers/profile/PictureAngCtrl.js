angular.module('InTouch')
    .controller('PictureAngCtrl', PictureAngCtrl);

PictureAngCtrl.$inject = ['$localStorage', 'ImageService', 'Actuality', '$scope', 'Image', '$rootScope',
'FileUploader', '$http', 'appLoading', 'toaster', 'preGetImages'];

function PictureAngCtrl($localStorage, ImageService, Actuality, $scope, Images, $rootScope,
  FileUploader, $http, appLoading, toaster, preGetImages) {

  console.log('----------------UPLOAD PICTURES------------------------');

  var vm                                      = this;
  var userToken                               = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;
  vm.profileImages                            = [];
  vm.doDefaultImage                           = doDefaultImage;
  vm.erase                                    = erase;
  vm.noImages                                 = false;
  vm.preview = false;

  appLoading.ready();

  var actuality = new Actuality();
  var image = new Image();

  $localStorage.searchField = null;
  
  if ($rootScope.currentUser) {
    vm.profileImages = preGetImages;
  }

  if ($rootScope.currentUser.images &&
    $rootScope.currentUser.images.length === 0) {
    vm.noImages = true;
  } else {
    vm.images = $rootScope.currentUser.images;
  }

  var uploader = $scope.uploader = new FileUploader({
    headers: {
      'auth-token': $rootScope.currentUser.token
    },
    url: '/upload'
  });

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/ , options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') +
        1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

  function doDefaultImage(image) {
    console.log(image);
    var status = ImageService.changeStatus(image.name, image._id, true);
    status.postImage().then(function() {
      console.log(preGetImages);
      vm.profileImages = status._profileImages;
      actuality.setActualityField(2, image.name);
      actuality.postActuality().then(function() {
        toaster.pop('success', 'L\'image de profil a bien été modifié');
        console.log('__AnnouncesCtrl $scope.initListAnnounce__');
      });
    });
  }

  function erase(image) {
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    console.log(image);
    image.setImage(image._id);
    image.deleteImage().then(function() {
      toaster.pop('danger', 'L\'image a bien été supprimé');
      for (var i in vm.profileImages) {
        if (vm.profileImages[i]._id == image._id) {
          console.log('test');
          vm.profileImages.splice(i, 1);
        }
      }
    });
  }

  /////////////////////////////////////////////////////////////////
  // CALLBACKS ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };

  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };

  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };

  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };

  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };

  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };

  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.log('results');
    vm.noImages = false;
    vm.preview = true;
    vm.image = response;
    appLoading.ready();
    console.info('onSuccessItem', fileItem, response, status, headers);
  };

  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };

  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };

  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
  };

  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

  console.info('uploader', uploader);
}
