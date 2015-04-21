/*
 * Module dependencies
 */
var path         = require('path');
var UsernameCtrl = require('../../controllers/users/usernamesCtrl');
var auth         = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
{
     path: '/api/usernames/',
     httpMethod: 'GET',
     middleware: [auth.ensureAuthenticated, UsernameCtrl.getUsername]
},
{
    path: '/api/usernames/',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, UsernameCtrl.saveUsername]
},
{
    path: '/api/usernames/',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, UsernameCtrl.deleteUsername]
}

];

module.exports = routes;
