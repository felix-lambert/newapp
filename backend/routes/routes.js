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
        console.log(req.flash);
        res.render('index');
      }
    ]
  },
];

module.exports = function(app) {
  console.log('**********************routes******************');

  var announceRoutes          = require('./announces/announceRoutes');
  var messageRoutes           = require('./sockets/messageRoutes');
  var userRoutes              = require('./users/userRoutes');
  var usernameRoutes          = require('./users/usernameRoutes');
  var findRoutes              = require('./users/findRoutes');
  var profileRoutes           = require('./users/profileRoutes');
  var sessionRoutes           = require('./sessions/sessionRoutes');
  var announcesCommentsRoutes = require('./announces/announcesCommentsRoutes');
  var transactionRoutes       = require('./transactionRoutes');
  var notificationRoutes      = require('./sockets/notificationRoutes');
  var statusRoutes            = require('./statusRoutes');
  var friendsRoutes           = require('./sockets/friendsRoutes');

  var routes = announceRoutes
  .concat(friendsRoutes)
  .concat(userRoutes)
  .concat(usernameRoutes)
  .concat(profileRoutes)
  .concat(findRoutes)
  .concat(notificationRoutes)
  .concat(statusRoutes)
  .concat(messageRoutes)
  .concat(sessionRoutes)
  .concat(announcesCommentsRoutes)
  .concat(transactionRoutes)
  .concat(indexRoutes);

  // require('phx-pagination').init(app);

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
