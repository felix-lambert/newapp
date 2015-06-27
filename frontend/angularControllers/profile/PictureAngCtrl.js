angular.module('InTouch')
    .controller('PictureAngCtrl', PictureAngCtrl);

PictureAngCtrl.$inject = ['Actuality', '$scope', 'Images', '$rootScope',
'FileUploader', '$http', 'appLoading', 'toaster'];

function PictureAngCtrl(Actuality, $scope, Images, $rootScope,
  FileUploader, $http, appLoading, toaster) {

  console.log('--------------UPLOAD PICTURES----------------------');
  
  var vm                                      = this;
  var userToken                               = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;
  vm.profileImages                            = [];
  vm.doDefaultImage                           = doDefaultImage;
  vm.erase                                    = erase;
  vm.noImages                                 = false;

  appLoading.ready();
  if ($rootScope.currentUser) {
    Images.getImages().then(function(response) {
      console.log(response);
      vm.profileImages = response;
    });
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
    Images.changeImageStatus({
      name: image.name,
      _id: image._id,
      defaultImage: true
    }).then(function() {});

    toaster.pop('success', 'L\'image de profil a bien été modifié');
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    Images.getImages().then(function(response) {
      console.log(response);
      vm.profileImages = response;
      Actuality.postActuality({status: 2, content:image.name}).then(function(res) {
        console.log(res);
      });
    });
  }

  function erase(image) {
    console.log(image);
    Images.erase(image._id).then(function() {});

    toaster.pop('danger', 'L\'image a bien été supprimé');
    console.log('__AnnouncesCtrl $scope.initListAnnounce__');
    Images.getImages().then(function(response) {
      console.log(response);
      vm.profileImages = response;
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
    vm.profileImages.push(response.images);
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
