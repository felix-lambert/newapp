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
    path: '/api/announcesput/:announceId',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.updateAnnounce]
}, {
    path: '/api/announces/:announceId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.deleteAnnounce]
}, {
    path: '/api/paginateannounces/:page',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.listPagination]
}, {
    path: '/api/userannounces/:page',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.listUserPagination]
}, {
    path: '/api/statusannounce/:announceId/:status',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, AnnouncesCtrl.changeStatusAnnounce]
}, {
    path: '/api/searchannounces/:terms',
    httpMethod: 'GET',
    middleware: [AnnouncesCtrl.searchAnnounces]
}, {
    path: '/api/searchannounces',
    httpMethod: 'POST',
    middleware: [AnnouncesCtrl.searchAnnounces]
}

];

module.exports = routes;
