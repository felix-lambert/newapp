/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var passport      = require('passport');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var User          = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

/////////////////////////////////////////////////////////////////
// AUTHENTIFICATION STRATEGY ////////////////////////////////////
/////////////////////////////////////////////////////////////////
module.exports = function(app) {
  'use strict';
  var PassportSocial = require('./passport/passportSocial.js');
  var config;

  if (process.env.NODE_ENV === 'production') {
    config = require('./passport/authConfigProd.json');
  } else {
    config = require('./passport/authConfigLocal.json');
  }

  /////////////////////////////////////////////////////////////////
  // USE PASSPORT SESSION /////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  app.use(passport.initialize());
  // passport.use(PassportSocial.facebookStrategy(config));
  // passport.use(PassportSocial.googleStrategy(config));
  // passport.use(PassportSocial.linkedInStrategy(config));
  passport.use(User.createStrategy());

};
