/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var chalk    = require('chalk');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH TOKEN Route middleware to ensure user is authenticated //
////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  'use strict';
  console.log('_________________Ensure authentification__________________');
  var incomingToken = req.headers['auth-token'];
  if (incomingToken) {
    User.decode(incomingToken, function(err, user) {
      if (err) {
        console.log(err);
        console.log(chalk.red(err));
        return res.status(400).json(err);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    console.log(chalk.red('There is no token'));
    res.status(400).json('There is no token');
  }
};
