/*
 * Module dependencies
 */
var path        = require('path');
var UserCtrl    = require('../../controllers/session/usersCtrl');
var FriendsCtrl = require('../../controllers/friendsCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/friends',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.postFriend]
}, {
    path: '/api/status/:statusId',
    httpMethod: 'GET',
    middleware: [UserCtrl.getStatus]
}, {
     path: '/api/notifications/',
     httpMethod: 'GET',
     middleware: [auth.ensureAuthenticated, UserCtrl.getNotification]
}, {
    path: '/api/friends/:friendId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.deleteFriend]
}, {
    path: '/api/friends/:friendId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.getAllFriends]
}, {
    path: '/api/friends/user/:userId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.getFriendsFromUser]
}, {
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
    middleware: [auth.ensureAuthenticated, UserCtrl.upload]
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

module.exports = function() {
  return routes;
};
