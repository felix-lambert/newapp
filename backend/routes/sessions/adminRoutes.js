/*
 * Module dependencies
 */
var path      = require('path');
var adminCtrl = require('../../controllers/session/adminCtrl');
var auth      = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/admin/addCategory',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, auth.hasAccess('admin'),
    adminCtrl.addCategory]
}, {
    path: '/api/admin/removeCategory/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, auth.hasAccess('admin'),
    adminCtrl.removeCategory]
}, {
    path: '/api/categories',
    httpMethod: 'GET',
    middleware: [adminCtrl.getCategories]
}, {
    path: '/api/admin/users',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, auth.hasAccess('admin'),
    adminCtrl.users]
}, {
    path: '/api/admin/users/:id',
    httpMethod: 'POST',
    middleware: [
        auth.ensureAuthenticated, auth.hasAccess('admin'), adminCtrl.editUser
    ]
}];

module.exports = function() {
  return routes;
};
