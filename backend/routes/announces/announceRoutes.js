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
    middleware: [AnnouncesCtrl.show]
}, {
    path: '/api/announces/:announceId/:content/:title',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.updateAnnounce]
}, {
    path: '/api/announces/:announceId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.deleteAnnounce]
}, {
    path: '/api/announces/:page/:limit/',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listPagination]
}, {
    path: '/api/announces/:page/:limit/:user',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listUserPagination]
}, {
    path: '/api/statusannounce/:announceId/:status',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.changeStatusAnnounce]
}, {
    path: '/api/searchannounces/:terms/:page',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.searchAnnounces]
}, {
    path: '/api/searchannounces',
    httpMethod: 'POST',
    middleware: [AnnouncesCtrl.searchAnnounces]
}

];

module.exports = routes;
