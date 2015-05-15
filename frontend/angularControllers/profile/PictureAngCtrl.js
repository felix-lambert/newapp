angular.module('InTouch')
    .controller('PictureAngCtrl', ['Images', '$scope', '$rootScope', 'FileUploader',
        '$http', PictureAngCtrl]);

function PictureAngCtrl(Images, $scope, $rootScope, FileUploader, $http) {

  console.log('--------------UPLOAD PICTURES----------------------');

  var userToken = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;

  $scope.noImages = false;
  if ($rootScope.currentUser) {
    Images.getImages().then(function(response) {
      console.log(response);
      $rootScope.currentUser.images = response;
      $scope.images = $rootScope.currentUser.images;
    });
  }


  if ($rootScope.currentUser.images && $rootScope.currentUser.images.length === 0) {
    $scope.noImages = true;
  } else {
    $scope.images = $rootScope.currentUser.images;
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
    $scope.noImages = false;
    $scope.images   = $rootScope.currentUser.images;
    console.log('_____ON SUCCESS_____');
    console.log(response.images);
    console.log(response);
    console.log($rootScope.currentUser);
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