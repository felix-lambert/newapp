/*
 * Module dependencies
 */
var path        = require('path');
var FriendsCtrl = require('../../controllers/friendsCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
{
    path: '/api/friends/:friendId/:user',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.deleteFriend]
}, {
    path: '/api/friends/:user',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.testIfFriend]
}, {
    path: '/api/countfriends/:idUser',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.countFriends]
}, {
    path: '/api/getfriends/:friendId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.getFriendsFromUser]
}, {
    path: '/api/friends/',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, FriendsCtrl.postFriend]
}
];

module.exports = routes;
