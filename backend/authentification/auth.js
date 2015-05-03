/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Username = mongoose.model('Username');

/////////////////////////////////////////////////////////////////
// AUTH TOKEN Route middleware to ensure user is authenticated //
/////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  'use strict';
  console.log('_________________Ensure authentification__________________');
  var incomingToken = req.headers['auth-token'];
  console.log('token : ' + incomingToken);
  if (incomingToken) {
    var decoded = User.decode(incomingToken);
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
    } else if (decoded && decoded.username) {
      Username.getUsernameToken(decoded.username, incomingToken,
        function(err, user) {
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
