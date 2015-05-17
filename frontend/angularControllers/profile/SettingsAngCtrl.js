angular.module('InTouch')
  .controller('SettingsAngCtrl', SettingsAngCtrl);

function SettingsAngCtrl($scope, $http, $rootScope, Profile) {
  $scope.editProfile = false;
  $scope.errorEmail  = false;
  var initUser       = null;
  var userToken = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;

  Profile.query(function(data) {
    $scope.profile = data;
  });

  $http({
    method: 'GET',
    url: '/getReputation'
      })
      .success(function(data, status, headers, config) {
        $scope.reputation = data.reputation;
        $scope.rated      = data.rated;
        $scope.total      = data.total;
      })
      .error(function(data, status, headers, config) {
          // erreur de récupération :(
      });

  $scope.toggleEditProfile = function() {
    if ($scope.editProfile) {
      $scope.editProfile = false;
      $scope.profile     = initUser;
    } else {
      initUser = {
          email: $scope.profile.email,
          firstName: $scope.profile.firstName,
          lastName: $scope.profile.lastName,
          age: $scope.profile.age,
      };
      $scope.editProfile = true;
    }
  };

  $scope.editProfileSubmit = function(form) {
    Profile.save({
        email: $scope.profile.email,
        firstName: $scope.profile.firstName,
        lastName: $scope.profile.lastName,
        age: $scope.profile.age
    }, function(res) {
      $scope.editProfile   = false;
      $scope.profile.email = res.email;
      $scope.errorEmail    = res.errorEmail;
    });
  };
}
