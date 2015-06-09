angular.module('InTouch')
    .controller('PictureAngCtrl', PictureAngCtrl);

PictureAngCtrl.$inject = ['$scope', 'Images', '$rootScope',
'FileUploader', '$http', 'appLoading'];

function PictureAngCtrl($scope, Images, $rootScope, FileUploader, $http, appLoading) {

  console.log('--------------UPLOAD PICTURES----------------------');

  var vm = this;

  appLoading.ready();

  vm.doDefaultImage = doDefaultImage;

  var userToken = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;

  vm.noImages = false;
  if ($rootScope.currentUser) {
    Images.getImages().then(function(response) {
      console.log(response);
      $rootScope.currentUser.images = response;
      vm.images = $rootScope.currentUser.images;
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
    $rootScope.currentUser.images = response.images;

    console.log($rootScope.currentUser);
    vm.noImages = false;
    vm.images   = $rootScope.currentUser.images;
    console.log('_____ON SUCCESS_____');
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
