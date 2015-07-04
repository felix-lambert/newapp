/*
 * Module dependencies
 */
var path             = require('path');
var NotificationCtrl = require('../../controllers/sockets/notificationCtrl');
var auth             = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [{
  path: '/api/notifications/',
  httpMethod: 'GET',
  middleware: [auth.ensureAuthenticated, NotificationCtrl.getNotifications]
}, {
  path: '/api/notifications/',
  httpMethod: 'POST',
  middleware: [auth.ensureAuthenticated, NotificationCtrl.saveNotification]
}, {
  path: '/api/notifications/',
  httpMethod: 'DELETE',
  middleware: [auth.ensureAuthenticated, NotificationCtrl.deleteNotification]
}];

module.exports = routes;
