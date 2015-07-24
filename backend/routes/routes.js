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
}, {
  path: '/*',
  httpMethod: 'GET',
  middleware: [
    function(req, res) {
      res.render('index');
    }
  ]},
];

module.exports = function(app) {
  console.log('********************************routes*************************************');

  var announceRoutes          = require('./announces/announceRoutes');
  var messageRoutes           = require('./sockets/messageRoutes');
  var roomsRoutes             = require('./sockets/roomsRoutes');
  var imageRoutes             = require('./imageRoutes');
  var userRoutes              = require('./users/userRoutes');
  var findRoutes              = require('./users/findRoutes');
  var sessionRoutes           = require('./sessions/sessionRoutes');
  var announcesCommentsRoutes = require('./announces/announcesCommentsRoutes');
  var notificationRoutes      = require('./sockets/notificationRoutes');
  var likeRoutes              = require('./sockets/likeRoutes');
  var statusRoutes            = require('./statusRoutes');
  var actualityRoutes         = require('./actualityRoutes');
  var friendsRoutes           = require('./sockets/friendsRoutes');

  var routes = announceRoutes
  .concat(friendsRoutes)
  .concat(imageRoutes)
  .concat(findRoutes)
  .concat(notificationRoutes)
  .concat(likeRoutes)
  .concat(statusRoutes)
  .concat(actualityRoutes)
  .concat(messageRoutes)
  .concat(roomsRoutes)
  .concat(sessionRoutes)
  .concat(announcesCommentsRoutes)
  .concat(indexRoutes);

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
