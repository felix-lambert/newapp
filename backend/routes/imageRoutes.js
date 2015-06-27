/*
 * Module dependencies
 */
var path      = require('path');
var ImageCtrl = require('../controllers/imagesCtrl');
var auth      = require('../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/upload',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, ImageCtrl.upload]
}, {
    path: '/api/images',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, ImageCtrl.getImages]
}, {
    path: '/api/images/:imageId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, ImageCtrl.deleteImage]
}, {
    path: '/api/images/:userId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, ImageCtrl.getImages]
}, {
    path: '/api/images/:imageName/:imageId/:defaultImage',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, ImageCtrl.changeImageStatus]
}];

module.exports = routes;
