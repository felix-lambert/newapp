angular.module('InTouch')
  .service('AuthService', AuthService);

AuthService.$inject = ['AuthInterface'];

console.log('Auth service');

function AuthService(AuthInterface) {
	this.authenticate = function(user_email, password) {
		console.log('auth service');
		console.log(user_email);
		console.log(password);
    return new AuthInterface(user_email, password);
	}
};


