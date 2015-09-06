angular.module('InTouch').factory('Auth', Auth);

Auth.$inject = ['$rootScope', 'Session', '$http'];

function Auth($rootScope, Session, $http) {
  
  var Auth = function() {
    this._loginField = null;
    this._registerField = null;
    this._profile = null;
    this._error = null;
  };

  Auth.prototype = {
    constructor: Auth,
    setLoginField: setLoginField,
    setRegisterField: setRegisterField,
    login: login,
    createUser: createUser,
    currentUser: currentUser
  };

  return Auth;

  function setProfile(name) {
    this._name = name;
  }

  function setLoginField(email, password) {
    this._loginField = {
      email: email,
      password: password
    };
  }

  function setRegisterField(username, email, password, repeatPassword) {
    this._registerField = {
      username: username,
      email: email,
      password: password,
      repeatPassword: repeatPassword
    };
  }

  function login() {
    var self = this;
    return $http.post('/auth/login', self._loginField).then(function(response) {
      console.log('________________RESPONSE LOGIN____________');
      console.log(response.data);
      self._profile = response.data;
      return response;
    }, function(response) {
      console.log('test error');
      console.log(response);
      console.log(response.data.err);
      self._error = response.data.err;
      return response;
    });

  }

  function createUser() {
    console.log('************createUser********************');
    var self = this;
    return $http.post('/auth/register', self._registerField).then(function(response) {
      console.log('Create user');
      self._profile = response.data;
      $localStorage.currentUser = self._profile;
      $rootScope.currentUser = self._profile;
      return response;
    }, function(response) {
      console.log('ERROR');
      console.log(response);
      self._error = response.data;
      return response;
    });
  }

  function currentUser() {
    console.log('************currentUser********************');
    Session.get(function(user) {
      $rootScope.currentUser = user;
    });
  }

}
