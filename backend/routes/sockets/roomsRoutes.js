/*
 * Module dependencies
 */
var path         = require('path');
var RoomsCtrl    = require('../../controllers/sockets/roomCtrl');
var auth         = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
  {
    path: '/api/rooms',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, RoomsCtrl.create]
  },
  {
    path: '/api/rooms/:roomId',
    httpMethod: 'PUT',
    middleware: [auth.ensureAuthenticated, RoomsCtrl.update]
  },
  {
    path: '/api/rooms/:roomId',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, RoomsCtrl.destroy]
  },
  {
    path: '/api/rooms',
    httpMethod: 'GET',
    middleware: [auth.ensureAuthenticated, RoomsCtrl.all]
  }
];

module.exports = routes;
