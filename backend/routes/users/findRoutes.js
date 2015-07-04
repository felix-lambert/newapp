/*
 * Module dependencies
 */
var path     = require('path');
var FindCtrl = require('../../controllers/users/findCtrl');
var auth     = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/search',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FindCtrl.search]
}, {
    path: '/auth/username-exists',
    httpMethod: 'GET',
    middleware: [FindCtrl.userExist]
}, {
    path: '/auth/email-exists',
    httpMethod: 'GET',
    middleware: [FindCtrl.emailExist]
}];

module.exports = routes;
