angular.module('InTouch')
  .controller('SettingsAngCtrl', SettingsAngCtrl);

SettingsAngCtrl.$inject = ['$http', '$rootScope', 'appLoading', 'Profile'];

function SettingsAngCtrl($http, $rootScope, Profile) {

  var vm = this;

  vm.editProfile = false;
  vm.errorEmail  = false;
  var initUser       = null;
  var userToken = $rootScope.currentUser.token;
  $http.defaults.headers.common['auth-token'] = userToken;

  Profile.query(function(data) {
    vm.profile = data;
  });

  $http({
    method: 'GET',
    url: '/getReputation'
      })
      .success(function(data, status, headers, config) {
        vm.reputation = data.reputation;
        vm.rated      = data.rated;
        vm.total      = data.total;
      })
      .error(function(data, status, headers, config) {
          // erreur de récupération :(
      });

  vm.toggleEditProfile = function() {
    if (vm.editProfile) {
      vm.editProfile = false;
      vm.profile     = initUser;
    } else {
      initUser = {
          email: vm.profile.email,
          firstName: vm.profile.firstName,
          lastName: vm.profile.lastName,
          age: vm.profile.age,
      };
      vm.editProfile = true;
    }
  };

  vm.editProfileSubmit = function(form) {
    Profile.save({
        email: vm.profile.email,
        firstName: vm.profile.firstName,
        lastName: vm.profile.lastName,
        age: vm.profile.age
    }, function(res) {
      vm.editProfile   = false;
      vm.profile.email = res.email;
      vm.errorEmail    = res.errorEmail;
    });
  };
}
