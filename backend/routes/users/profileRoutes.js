/*
 * Module dependencies
 */
var path        = require('path');
var ProfileCtrl = require('../../controllers/users/profileCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/profile',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, ProfileCtrl.profile]
}, {
    path: '/api/profile',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ProfileCtrl.editProfile]
}, {
    path: '/api/user/profile-image',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ProfileCtrl.defineProfileImage]
},
];

module.exports = routes;
