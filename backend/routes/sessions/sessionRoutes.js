/*
 * Module dependencies
 */
var path        = require('path');
var passport    = require('passport');
var SessionCtrl = require('../../controllers/session/sessionCtrl');
var auth        = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
  /*
   * Authentication routes
   */
  {
      path: '/auth/login',
      httpMethod: 'DELETE',
      middleware: [SessionCtrl.logout]
  }, {
      path: '/auth/session',
      httpMethod: 'GET',
      middleware: [auth.ensureAuthenticated, SessionCtrl.getSession]
  },
  /**
   * Post method to register a new user
   */
  {
      path: '/auth/register',
      httpMethod: 'POST',
      middleware: [SessionCtrl.register]
  },

  /**
   * Login method
   */
  {
      path: '/auth/login',
      httpMethod: 'POST',
      middleware: [passport.authenticate('local', {session: false}),
      SessionCtrl.authenticate]
  }
];

module.exports = routes;
