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
},
];

module.exports = routes;
