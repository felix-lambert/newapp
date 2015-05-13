/*
 * Module dependencies
 */
var path         = require('path');
var MessagesCtrl = require('../../controllers/sockets/messageCtrl');
var auth         = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
        path: '/api/messages',
        httpMethod: 'POST',
        middleware: [MessagesCtrl.create]
    },
    {
        path: '/api/messages/:messageId',
        httpMethod: 'GET',
        middleware: [MessagesCtrl.all]
    }
];

module.exports = routes;
