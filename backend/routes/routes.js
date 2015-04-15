/*
 * Module dependencies
 */
var _             = require('underscore');
var path          = require('path');
var express       = require('express');
var auth          = require('../authentification/auth');
var AnnouncesCtrl = require('../controllers/announces/announcesCtrl');
var FriendsCtrl   = require('../controllers/friendsCtrl');
var MessagesCtrl  = require('../controllers/sockets/messageCtrl');

/**
 * Expose routes
 */
var router = express.Router();

/**
 * Defines routes for application
 */
var indexRoutes = [
  {
    path: '/partials/*',
    httpMethod: 'GET',
    middleware: [
      function(req, res) {
        console.log('_____________get /partials/_____');
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
      }
    ]
  },
  {
    path: '/*',
    httpMethod: 'GET',
    middleware: [
      function(req, res) {
        res.render('index');
      }
    ]
  }
];

module.exports = function(app) {
  console.log('**********************routes******************');

  var announceRoutes          = require('./announces/announceRoutes')();
  var adminRoutes             = require('./sessions/adminRoutes')();
  var messageRoutes           = require('./sockets/messageRoutes')();
  var userRoutes              = require('./sessions/userRoutes')();
  var sessionRoutes           = require('./sessions/sessionRoutes')();
  var announcesCommentsRoutes = require('./announces/announcesCommentsRoutes')();
  var transactionRoutes       = require('./transactionRoutes')();
  var notificationRoutes      = require('./sockets/notificationRoutes')();
  var statusRoutes            = require('./statusRoutes')();

  var routes = announceRoutes.concat(adminRoutes)
  .concat(messageRoutes)
  .concat(userRoutes)
  .concat(sessionRoutes)
  .concat(announcesCommentsRoutes)
  .concat(transactionRoutes)
  .concat(indexRoutes)
  .concat(notificationRoutes)
  .concat(statusRoutes);

  app.param('announceId', AnnouncesCtrl.getAnnounce, AnnouncesCtrl.show);
  app.param('friendId', FriendsCtrl.getAllFriends);
  app.param('messageId', MessagesCtrl.all);

  _.each(routes, function(route) {
    var args = _.flatten([route.path, route.middleware]);
    switch (route.httpMethod.toUpperCase()) {
      case 'GET':
        app.get.apply(app, args);
        break;
      case 'POST':
        app.post.apply(app, args);
        break;
      case 'PUT':
        app.put.apply(app, args);
        break;
      case 'DELETE':
        app.delete.apply(app, args);
        break;
      default:
        throw new Error('Invalid HTTP method specified for route ' +
            route.path);
    }
  });
};
