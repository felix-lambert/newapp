/*
 * Module dependencies
 */
var path                  = require('path');
var AnnouncesCommentsCtrl = require('../../controllers/announces/announcesCommentsCtrl');
var auth                  = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/announceComment/:announceId',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, AnnouncesCommentsCtrl.addComment]
}, {
    path: '/api/announceComment/:id',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, AnnouncesCommentsCtrl.removeComment]
}, {
    path: '/api/announceComment/:announceId',
    httpMethod: 'GET',
    middleware: [AnnouncesCommentsCtrl.getComments]
}];

module.exports = routes;
