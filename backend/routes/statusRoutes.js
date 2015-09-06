/*
 * Module dependencies
 */
var path       = require('path');
var StatusCtrl = require('../controllers/statusCtrl');
var auth       = require('../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/status/:statusId',
    httpMethod: 'GET',
    middleware: [StatusCtrl.getStatus]
}, {
    path: '/api/status/:statusId',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, StatusCtrl.addStatus]
}, {
    path: '/api/status/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, StatusCtrl.deleteStatus]
}];

module.exports = routes;
