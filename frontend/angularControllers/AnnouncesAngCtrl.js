angular.module('InTouch')
.controller('AnnouncesAngCtrl', ['Announce', '$scope', '$http', 'announces',
  'comments', '$location', '$routeParams', '$rootScope', 'toaster', '$modal',
  'transactions', function(Announce, $scope, $http, announces, comments,
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
      rating: null
    };

    $scope.decorateNumberPage = function(page, decoration, weight) {
      $('#bt' + page).css('text-decoration', decoration);
      $('#bt' + page).css('font-weight', weight);
    };

    $scope.page = 1;
    $scope.limit = 5;
    $scope.total = 0;
    $scope.pageNumbers = [];
    
    $scope.paginate = function(page) {
      $scope.page = page;
      Announce.paginate({
          page : $scope.page,
          limit : $scope.limit
      }, function(data) {
        $scope.announces = data.announces;
        $scope.total = data.total;
        $scope.pageNumbers = [];
        for (var i = 0; i < $scope.total; i++) {
          $scope.pageNumbers.push(i + 1);
        }
      });
      angular.forEach($scope.pageNumbers, function(page, key) {
        $scope.decorateNumberPage(page, 'none', 'normal');
      });
      $scope.decorateNumberPage(page, 'underline', 'bold');
    };

    $scope.paginateUser = function(page) {
      console.log('paginate user announces');
      $scope.page = page;
      announces.getAnnouncesFromUser({
          page : $scope.page,
          limit : $scope.limit,
          user: $rootScope.currentUser._id
      }).then(function(data) {
        console.log(data.announces);
        $scope.announces = data.announces;
        $scope.total = data.total;
        $scope.pageNumbers = [];
        for (var i = 0; i < $scope.total; i++) {
          $scope.pageNumbers.push(i + 1);
        }
      });
      angular.forEach($scope.pageNumbers, function(page, key) {
        $scope.decorateNumberPage(page, 'none', 'normal');
      });
      $scope.decorateNumberPage(page, 'underline', 'bold');
    };

    $scope.listUsers = function() {
      $scope.paginate($scope.page);
    };

    $scope.previous = function() {
      if ($scope.page > 1) {
        $scope.page--;
      }
      $scope.paginate($scope.page);
    };

    $scope.previousUser = function() {
      if ($scope.page > 1) {
        $scope.page--;
      }
      $scope.paginateUser($scope.page);
    };

    $scope.next = function() {
      console.log($scope.page);
      console.log($scope.total);
      if ($scope.page < $scope.total) {
        $scope.page++;
      }
      $scope.paginate($scope.page);
    };

    $scope.nextUser = function() {
      console.log($scope.page);
      console.log($scope.total);
      if ($scope.page < $scope.total) {
        $scope.page++;
      }
      $scope.paginateUser($scope.page);
    };

    $scope.reset = function() {
      $scope.successMessage = null;
      $scope.errorMessage = null;
      $scope.nameErrorMessage = null;
      $scope.usernameErrorMessage = null;
      $scope.passwordErrorMessage = null;
      $scope.listUsers();
    };

    // $scope.pageChangeHandler = function(num, size) {
    //   console.log('page change handler');
    //   console.log(num);
    //   console.log(size);
    //   announces.getAnnouncesPerPage(num, size, 1).then(function(res) {
    //     console.log(res);
    //     $scope.announces = res;
    //   });
    //   console.log('going to page ' + num);
    // };

    // $scope.changeAnnouncesPerPage = function(size) {
    //   console.log($scope.currentPage);
    //   console.log(size);
    //   announces.getAnnouncesPerPage($scope.currentPage, size, 1).then(function(res) {
    //     console.log(res);
    //     $scope.announces = res;
    //   });
    // };
    

    // $scope.getAnnouncesPerPage = function(currentPage) {
    //   announces.getAnnouncesPerPage(currentPage, 10, 1).then(function(res) {
    //     console.log(res);
    //     $scope.announces = res;
    //   });
    // };

    // function filterAndSortAnnounces() {
    //   console.log('_________filterAndSortannounces_______');
    //   $scope.announces = [];
    //   angular.forEach(allAnnounces, function(item, key) {
    //     if (filter.rating && filter.rating !== item.rating) {
    //       return;
    //     }
    //     $scope.announces.push(item);
    //   });
    // }

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
        activated: true
      }).then(function(response) {
        console.log(response);
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
      });
    };

    $scope.remove = function(announce) {
      console.log('remove');
      console.log(announce);
      announces.deleteAnnounce(announce._id).then(function(err) {});
      for (var i in $scope.announces) {
        if ($scope.announces[i] == announce) {
          $scope.announces.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      console.log('____________________update_____________________');
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
      announces.putAnnounce({
        _id: id,
        activated: false
      }).then(function() {});

      toaster.pop('warning', 'Ce service est désactivé');
      console.log('__AnnouncesCtrl $scope.initListAnnouce__');
      $scope.noAnnounces = false;
      $scope.findFromUser($rootScope.currentUser._id);
      // announce.$update({announceId: id}, function() {
      // });
    };

    $scope.activate = function(id) {
      // var announce = new announces({activated : false});
      announces.putAnnounce({
        _id: id,
        activated: true
      }).then(function() {});

      toaster.pop('success', 'Ce service est activé');
      $scope.findFromUser($rootScope.currentUser._id);
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
        $scope.comments = res;
      });
    };

    $scope.postComment = function() {

      comments.postComment({
        content: $scope.AnnounceComment,
        rating: this.rating,
      }, $routeParams.announceId).then(function(res) {
        if (res.newRating !== null) {
          $scope.announceRating = res.newRating;
        }
        $scope.AnnounceComment = '';
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
        console.log('delete');
      });
    };

    // $scope.getCategories = function() {
    //   $http({
    //     method: 'GET',
    //     url: '/api/categories',
    //   }).success(function(data, status, headers, config) {
    //     $scope.categories = data;
    //   });
    // };

    $scope.initListAnnounce = function() {
      console.log('__AnnouncesCtrl $scope.initListAnnouce__');

      $scope.paginate($scope.page);
      // $scope.$watch('filter', filterAndSortAnnounces, true);
    };

    $scope.initListCreateAnnounce = function(id) {
      // console.log('__AnnouncesCtrl $scope.initListAnnouce__');
      // $scope.noAnnounces = false;
      // $scope.findFromUser(id);
      // // $scope.$watch('filter', filterAndSortAnnounces, true);
      // $scope.getCategories();
      $scope.paginateUser($scope.page);
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

  }]);
