angular.module('InTouch').controller('TransactionAngCtrl', ['$scope',
  '$rootScope', '$http', 'transactions', '$timeout', '$modal',
  TransactionAngCtrl]);

function TransactionAngCtrl($scope, $rootScope, $http, transactions, $timeout, $modal) {
  
  if ($rootScope.currentUser) {
    var userToken = $rootScope.currentUser.token;
    $http.defaults.headers.common['auth-token'] = userToken;
  }
  $scope.tab          = 1;
  $scope.currentMoney = 0;
  $scope.errorRequest = null;

  $scope.rejectTransac = function(transac) {
    var id = transac._id;
    $http({
      method:'GET',
      url:'/api/transaction/' + id + '/reject'
    }).success(function(data) {
      transac.status = data.status;
      transac.rejected = data.rejected;
      transac.statusInformation = data.statusInformation;
    }).error(function(data) {
      $scope.errorRequest = data.message;
      $timeout(function() {
        $scope.errorRequest = null;
      }, 3000);
    });
  };

  $scope.acceptTransac = function(transac) {
    $http({
      method:'GET',
      url:'/api/transaction/' + transac._id + '/accept'
    }).success(function(data) {
      transac.status = data.status;
      transac.statusInformation = data.statusInformation;
      if (data.status == 1 &&
        (($rootScope.currentUser._id == data.client.uId &&
          data.client.status == 1) ||
          ($rootScope.currentUser._id == data.owner.uId &&
            data.owner.status == 1))) {
        transac.showAcceptLink = false;
      } else {
        transac.showAcceptLink = true;
      }
    }).error(function(data) {
      $scope.errorRequest = data.message;
      $timeout(function() {
        $scope.errorRequest = null;
      }, 5000);
    });
  };

  var requestReceived = function(transac) {
    $http({
      method:'GET',
      url:'/api/transaction/' + transac._id + '/received'
    }).success(function(data) {
      transac.status = data.transac.status;
      transac.statusInformation = data.transac.statusInformation;
      $scope.currentMoney = data.money;
    }).error(function(data) {
      $scope.errorRequest = data.message;
      $timeout(function() {
        $scope.errorRequest = null;
      }, 3000);
    });
  };

  $scope.signalTransacAsReceived = function(transac) {
    var modalInstance = $modal.open({
        templateUrl: 'views/partials/transaction/receivedModal.html',
        controller: 'transactionModalCtrl',
        scope:$scope,
        resolve: {
          transac: function() {
            return transac;
          }
        },
    });

    modalInstance.result.then(function(data) {
      $http({
        method:'POST',
        url: '/api/transaction/' + transac._id + '/postRating',
        data: data
      }).success(function(data) {
        requestReceived(transac);
      }).error(function(data) {
        $scope.errorRequest = data.message;
        $timeout(function() {
          $scope.errorRequest = null;
        }, 5000);
      });
    }, function() {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $scope.signalTransacAsNotReceived = function(transac) {
    console.log('2');
  };

  $scope.init = function() {
    transactions.get(function(data) {

      $scope.currentMoney = data.money ? data.money : 0;
      var trclient = data.client;
      var trowner = data.owner;
      for (var i = 0; l = trclient.length, i < l; i++) {
        if (trclient[i].status == 1) {
          if (($rootScope.currentUser._id == trclient[i].client.uId &&
            trclient[i].client.status == 1) ||
            ($rootScope.currentUser._id == trclient[i].owner.uId &&
              trclient[i].owner.status == 1)) {
            trclient[i].showAcceptLink = false;
          } else {
            trclient[i].showAcceptLink = true;
          }
        }
      }
      for (var j = 0; l = trowner.length, i < l; j++) {
        if (trowner[j].status == 1) {
          if (($rootScope.currentUser._id == trowner[j].client.uId &&
            trowner[j].client.status == 1) ||
            ($rootScope.currentUser._id == trowner[j].owner.uId &&
              trowner[j].owner.status == 1)) {
            trowner[j].showAcceptLink = false;
          } else {
            trowner[j].showAcceptLink = true;
          }
        }
      }
      $scope.transactionClient = trclient;
      $scope.transactionOwner = trowner;
    }, function(error) {
      console.log(error);
    });
  };
}

