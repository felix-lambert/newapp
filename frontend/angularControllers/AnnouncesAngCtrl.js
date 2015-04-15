angular.module('InTouch')
.controller('AnnouncesAngCtrl', ['$scope', '$http', 'announces', 'comments',
  '$location', '$routeParams', '$rootScope', 'toaster', '$modal',
  'transactions', function($scope, $http, announces, comments,
    $location, $routeParams, $rootScope, toaster, $modal, transactions) {

    console.log('*************AnnounceCtrl************************');
    var userToken = null;
    $scope.selectedImages = null;

    if ($rootScope.currentUser) {
      userToken = $rootScope.currentUser.token;
      $http.defaults.headers.common['auth-token'] = userToken;
    }
    var allAnnounces = [];

    var filter = $scope.filter = {
      category: [],
      rating: null
    };

    $scope.pageSize = 10;
    $scope.currentPage = 1;

    $scope.pageChangeHandler = function(num) {
      console.log('meals page changed to ' + num);
    };

    $scope.categories = [];

    function filterAndSortAnnounces() {
      console.log('_________filterAndSortannounces_______');
      $scope.announces = [];
      console.log('filter category : [' + filter.category + ']');
      angular.forEach(allAnnounces, function(item, key) {
        if (filter.rating && filter.rating !== item.rating) {
          return;
        }
        if (filter.category.length && item.category &&
          filter.category.indexOf(item.category.title) === -1) {
          return;
        }
        $scope.announces.push(item);
      });
    }

    $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
        input.push(i);
      }
      return input;
    };

    $scope.create = function() {
      announces.postAnnounce({
        title: this.title,
        content: this.content,
        type: this.type,
        category: this.category,
        price: this.price,
        images: this.selectedImages,
      }).then(function(response) {
        $location.path('announces/' + response._id);
      });

      this.title = '';
      this.content = '';
      announces.getAnnounces().then(function(announces) {
        console.log(announces);
        $scope.announces = announces;
        $scope.announces.push({
          '_id': $scope._id,
          'title': $scope.title,
          'type': $scope.type,
          'category': $scope.category
        });
        $scope.title = '';
        $scope.category = '';
        $scope.type = '';

      });
    };

    $scope.remove = function(announce) {
      console.log(announce);
      announces.deleteAnnounce(announce._id).then(function(announce) {});
      for (var i in $scope.announces) {
        if ($scope.announces[i] == announce) {
          $scope.announces.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      announces.putAnnounce({
        _id: $scope.announce._id,
        content: $scope.announce.content,
        created: $scope.announce.created,
        creator: $scope.announce.creator,
        images: $scope.selectedImages,
        price: $scope.announce.price,
        status: $scope.announce.status,
        title: $scope.announce.title,
        updated: $scope.announce.updated
      }).then(function(announce) {
        $location.path('/announces/' + announce._id);
      });
    };

    $scope.desactivate = function(id) {
      // var announce = new announces({activated : false});
      toaster.pop('warning', 'Ce service est désactivé');
      // announce.$update({announceId: id}, function() {
      // });
    };

    $scope.find = function() {
      announces.getAnnounces().then(function(announces) {
        if (!announces) {
          $scope.noAnnounces = true;
        }
        $scope.announces = announces;
        allAnnounces = announces;
      });
    };

    $scope.findFromUser = function(userId) {
      announces.getAnnouncesFromUser(userId).then(function(announces) {
        console.log('___FROM USER____');
        console.log(announces);
        $scope.announces = announces;
        allAnnounces = announces;
      });
    };

    $scope.findOne = function() {
      announces.getAnnounceById($routeParams.announceId).then(function(res) {
        console.log('announce found________');
        console.log(res);
        $scope.announce = res;
        $scope.announceRating = res.rating;
        $scope.selectedImages = res.images;
      });
    };

    $scope.getComments = function() {
      comments.getAnnounceComments($routeParams.announceId)
      .then(function(res) {
        console.log('GET COMMENTS');
        console.log(res);
        $scope.comments = res;
      });
    };

    $scope.postComment = function() {
      comments.postComment({
        content: this.AnnounceComment,
        rating: this.rating,
      }, $routeParams.announceId).then(function(res) {
        if (res.newRating !== null) {
          $scope.announceRating = res.newRating;
        }
        $scope.getComments();
      });
    };

    $scope.removeComment = function(comment) {
      comments.deleteComment(comment._id).then(function(res) {
        for (var i in $scope.comments) {
          if ($scope.comments[i] == comment) {
            $scope.comments.splice(i, 1);
          }
        }
      });
    };

    $scope.getCategories = function() {
      $http({
        method: 'GET',
        url: '/api/categories',
      }).success(function(data, status, headers, config) {
        $scope.categories = data;
      });
    };

    $scope.initListAnnounce = function() {
      console.log('__AnnouncesCtrl $scope.initListAnnouce__');
      $scope.noAnnounces = false;
      $scope.find();
      $scope.$watch('filter', filterAndSortAnnounces, true);
      $scope.getCategories();
    };

    $scope.initViewAnnouce = function() {
      console.log('__AnnouncesCtrl $scope.initViewAnnounce__');
      $scope.findOne();
      $scope.getComments();
    };

    $scope.startTransaction = function() {
      var transac = new transactions({
        announce: $scope.announce._id,
        clientprice: $scope.clientprice,
      });
      transac.$save(function(response) {
        $location.path('/transaction');
      }, function(error) {
        if (error.data && error.data.message) {
          $scope.transactionError = error.data.message;
        }
      });
    };

    var uploadSettings = {
      tbz:'tbz',
      thumbSize:80,
      thumbMax:9,
      url: '/api/upload/img',
      onUpload: 'filesUploaded',
      onUploadFail: 'failUpload',
      onFilesDrop: 'onFilesDrop',
      onFileRemove: 'onFileRemove',
      background:'Glissez et Déposez vos images',
      headers : {
        'auth-token' : userToken,
      }
    };

    $scope.AddImages = function() {
      var modalInstance = $modal.open({
        templateUrl: 'views/modals/uploadModal.html',
        controller: 'uploadModalCtrl',
        scope:$scope,
        resolve: {
          settings: function() {
            return uploadSettings;
          },
          selectedImages : function() {
            return $scope.selectedImages;
          }
        },
      });

      modalInstance.result.then(function(data) {
        $scope.selectedImages = data;
      }, function() {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
  }]);
