/*
 * Module dependencies
 */
var path        = require('path');
var FriendsCtrl = require('../../controllers/friendsCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
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
    path: '/api/friends/',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.postFriend]
},
];

module.exports = routes;
