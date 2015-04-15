/*
 * Module dependencies
 */
var path            = require('path');
var transactionCtrl = require('../controllers/transactionCtrl');
var auth            = require('../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
    {
        path: '/api/money',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.myMoney]
    },
    {
        path: '/api/transactions',
        httpMethod: 'POST',
        middleware: [auth.ensureAuthenticated, transactionCtrl.create]
    },
    {
        path: '/api/transactions',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.getAll]
    },
    {
        path: '/api/transaction/:id/reject',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.reject]
    },
    {
        path: '/api/transaction/:id/accept',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.accept]
    },
    {
        path: '/api/transaction/:id/received',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.received]
    },
    {
        path: '/api/transaction/:id/notReceived',
        httpMethod: 'GET',
        middleware: [auth.ensureAuthenticated, transactionCtrl.notReceived]
    },
    {
        path: '/api/transaction/:id/postRating',
        httpMethod: 'POST',
        middleware: [auth.ensureAuthenticated, transactionCtrl.postRating]
    }
 ];

module.exports = function() {
  return routes;
};
