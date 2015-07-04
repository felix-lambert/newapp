/*
 * Module dependencies
 */
var path     = require('path');
var UserCtrl = require('../../controllers/users/usersCtrl');
var auth     = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/auth/register/:id',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, UserCtrl.show]
}];

module.exports = routes;
