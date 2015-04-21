/*
 * Module dependencies
 */
var path        = require('path');
var UserCtrl    = require('../../controllers/users/usersCtrl');
var FriendsCtrl = require('../../controllers/friendsCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/search',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, UserCtrl.search]
}, {
    path: '/auth/register/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, UserCtrl.show]
}, {
    path: '/getReputation',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, UserCtrl.getReputation]
}, {
    path: '/upload',
    httpMethod: 'POST',
    middleware: [UserCtrl.upload]
}, {
    path: '/auth/username-exists',
    httpMethod: 'GET',
    middleware: [UserCtrl.userExist]
}, {
    path: '/auth/email-exists',
    httpMethod: 'GET',
    middleware: [UserCtrl.emailExist]
}, {
    path: '/api/profile',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, UserCtrl.profile]
}, {
    path: '/api/profile',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, UserCtrl.editProfile]
}, {
    path: '/api/user/profile-image',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, UserCtrl.defineProfileImage]
},
];

module.exports = routes;
