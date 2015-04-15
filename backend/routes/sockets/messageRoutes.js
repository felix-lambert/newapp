/*
 * Module dependencies
 */
var path         = require('path');
var MessagesCtrl = require('../../controllers/sockets/messageCtrl');
var RoomsCtrl    = require('../../controllers/sockets/roomCtrl');
var auth         = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
        path: '/api/messages',
        httpMethod: 'POST',
        middleware: [MessagesCtrl.create]
    }, {
        path: '/api/rooms',
        httpMethod: 'POST',
        middleware: [auth.ensureAuthenticated, RoomsCtrl.create]
    },
    {
        path: '/api/rooms/:roomId',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, RoomsCtrl.show]
    }, {
        path: '/api/rooms/:roomId',
        httpMethod: 'PUT',
        middleware: [auth.ensureAuthenticated, RoomsCtrl.update]
    }, {
        path: '/api/rooms/:roomId',
        httpMethod: 'DELETE',
        middleware: [auth.ensureAuthenticated, RoomsCtrl.destroy]
    },

    {
        path: '/api/messages/:messageId',
        httpMethod: 'GET',
        middleware: [MessagesCtrl.all]
    }, {
        path: '/api/rooms',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, RoomsCtrl.all]
    }
];

module.exports = function() {
  return routes;
};
