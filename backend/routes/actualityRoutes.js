/*
 * Module dependencies
 */
var path          = require('path');
var ActualityCtrl = require('../controllers/actualityCtrl');
var auth          = require('../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/actuality/',
    httpMethod: 'GET',
    middleware: [ActualityCtrl.getActualities]
}, {
    path: '/api/actuality',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ActualityCtrl.addActuality]
}, {
    path: '/api/actuality/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, ActualityCtrl.removeActuality]
}];

module.exports = routes;
