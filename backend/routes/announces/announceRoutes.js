/*
 * Module dependencies
 */
var path          = require('path');
var AnnouncesCtrl = require('../../controllers/announces/announcesCtrl');
var auth          = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
    path: '/api/announces',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.postAnnounce]
}, {
    path: '/api/announces/:announceId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.show]
}, {
    path: '/api/announces/:announceId',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.updateAnnounce]
}, {
    path: '/api/announces/:announceId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.deleteAnnounce]
}, {
    path: '/api/announces',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.getAllAnnounces]
}, {
    path: '/api/announces/list/:page/:perpage/:sort',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listPagination]
}, {
    path: '/api/announces/list/:page/:perpage',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listPagination]
}, {
    path: '/api/announces/list/:page',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listPagination]
}, {
    path: '/api/announces/user/:userId',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.getAnnouncesFromUser]
},
];

module.exports = routes;
