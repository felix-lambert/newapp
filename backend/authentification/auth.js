/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Token    = mongoose.model('Token');

/////////////////////////////////////////////////////////////////
// AUTH TOKEN Route middleware to ensure user is authenticated //
/////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  'use strict';
  console.log('_________________Ensure authentification__________________');
  var incomingToken = req.headers['auth-token'];
  if (incomingToken) {
    var decoded = User.decode(incomingToken);
    //Now do a lookup on that email in mongodb ... if exists it's a real user
    if (decoded && decoded.email) {
      User.getUserToken(decoded.email, incomingToken, function(err, user) {
        if (err) {
          console.log(err);
          res.status(400).json({error: 'Issue finding user.'});
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(400).json({error: 'Issue decoding incoming token.'});
    }
  } else {
    next();
  }
};

/////////////////////////////////////////////////////////////////
// CHECK IF PAGE AUTHORIZED /////////////////////////////////////
/////////////////////////////////////////////////////////////////
exports.hasAccess = function(accessLevel) {
  return function(req, res, next) {
      if (req.user && req.user.hasAccess(accessLevel)) {
        return next();
      }
      return res.status(400).json('Unauthorized');
    };
};
