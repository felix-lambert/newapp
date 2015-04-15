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
  }, {
      path: '/auth/google/callback',
      httpMethod: 'GET',
      middleware: [passport.authenticate('google', {
          successRedirect: '/',
          failureRedirect: '/'
      })]
  }, {
      path: '/auth/google',
      httpMethod: 'GET',
      middleware: [passport.authenticate('google', {
          scope: [
              'https://www.googleapis.com/auth/userinfo.profile',
              'https://www.googleapis.com/auth/userinfo.email'
          ]
      })]
  }, {
      path: '/auth/facebook',
      httpMethod: 'GET',
      middleware: [passport.authenticate('facebook')]
  }, {
      path: '/auth/facebook/callback',
      httpMethod: 'GET',
      middleware: [passport.authenticate('facebook', {
          successRedirect: '/',
          failureRedirect: '/'
      })]
  }, {
      path: '/auth/linkedin',
      httpMethod: 'GET',
      middleware: [passport.authenticate('linkedin', {
          state: 'DCEEFWF45453sdffef424'
      })]
  }, {
      path: '/auth/linkedin/callback',
      httpMethod: 'GET',
      middleware: [passport.authenticate('linkedin', {
          session: false,
          successRedirect: '/',
          failureRedirect: '/'
      })]
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

module.exports = function() {
  return routes;
};
