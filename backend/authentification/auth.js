/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH TOKEN Route middleware to ensure user is authenticated //
////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  'use strict';
  console.log('_________________Ensure authentification__________________');
  var incomingToken = req.headers['auth-token'];
  console.log(incomingToken);
  if (incomingToken) {
    var decoded = User.decode(incomingToken);
    if (decoded && decoded.email) {
      User.getUserToken(decoded.email, incomingToken, function(err, user) {
        if (err) {
          return res.status(400).json('Issue finding user');
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(400).json('Issue decoding incoming token');
    }
  } else {
    res.status(400).json('There is no token');
  }
};
