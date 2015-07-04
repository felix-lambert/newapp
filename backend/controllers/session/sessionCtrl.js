/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Username = mongoose.model('Username');
var passport = require('passport');
var ee       = require('../../config/event');
var async    = require('async');

User.createMapping(function(err, mapping) {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
    console.log(mapping);
  }
});

module.exports = {

  /////////////////////////////////////////////////////////////////
  // LOGOUT ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  logout: function(req, res) {
    console.log('******************logout******************');
    var incomingToken = req.headers['auth-token'];
    if (incomingToken) {
      var decoded = User.decode(incomingToken);
      if (decoded.email) {
        var decodeUser = decoded.email;
        User.invalidateUserToken(decodeUser,
          function(err, user) {
            console.log('invalidate token');
            console.log(user);
            if (err) {
              ee.emit('error', err);
              res.status(400).json({error: 'Issue finding user.'});
            } else {
              res.status(200).json(true);
            }
          });
      } else if (decoded.username) {
        var decodeUsername = decoded.username;
        Username.invalidateUsernameToken(decodeUsername,
          function(err, user) {
          if (err) {
            ee.emit('error', err);
            res.status(400).json({error: 'Issue finding user.'});
          } else {
            res.redirect('/');
          }
        });
      } else {
        res.status(400).json({error: 'Issue decoding incoming token.'});
      }
    }
  },

  /////////////////////////////////////////////////////////////////
  // AUTHENTICATE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  passportAuthenticate: function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', {session: false}, function(err, user, info) {
      if (user === false) {
        console.log(info.message);
        return res.status(400).json({
          err: info.message
        });
      } else {
        console.log(user);
        req.user = user;
        next();
      }
    })(req, res);
  },

  authenticate: function(req, res) {

    function createToken(createTokenCallback) {
      User.createUserToken(req.user.email, function(err, userToken) {
        if (err) {
          createTokenCallback(err);
        } else {
          createTokenCallback(null, userToken);
        }
      });

    }

    function getToken(userToken, getTokenCallback) {
      User.getUserToken(req.user.email, userToken, function(err, user) {
        if (err) {
          ee.emit('error', err);
          getTokenCallback(err);
        } else {
          getTokenCallback(null, user);
        }
      });

    }

    // Faire une promise
    async.waterfall([createToken, getToken], function(error, result) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json({
          _id: result._id,
          email: result.email,
          username: result.username,
          token: result.token.token,
          reputation: result.reputation,
          profileImage: result.profileImage,
          DATE_CREATED: result.FORMATTED_DATE,
        });
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // REGISTER /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  register: function(req, res, next) {
    console.log('**********************Register***********************');

    function registerUserMongo(registerUserMongoCallback) {
      if (req.body.password === req.body.confPassword) {
        var user = new User({
          username: req.body.username,
          email: req.body.email,
          profileImage: null,
        });
        User.register(user, req.body.password, function(error, result) {
          if (error) {
            registerUserMongoCallback(error);
          } else {
            registerUserMongoCallback(null, result);
          }
        });
      } else {
        registerUserMongoCallback('The confirm password does not match');
      }
    }

    function registerUserES(user, registerUserESCallback) {
      console.log('registerUserES');
      console.log(user);
      user.on('es-indexed', function(err, res) {
        console.log('document indexed');
        if (err) {
          registerUserESCallback(error);
        } else {
          registerUserESCallback(null);
        }
      });
    }

    function createToken(createTokenCallback) {

      User.createUserToken(req.body.email, function(err, usersToken) {
        if (err) {
          createTokenCallback(err);
        } else {
          createTokenCallback(null, usersToken);
        }
      });

    }

    function getToken(usersToken, getTokenCallback) {
      User.getUserToken(req.body.email, usersToken, function(err, user) {
        if (err) {
          getTokenCallback(err);
        } else {
          getTokenCallback(null, user);
        }
      });
    }

    // Faire une promise
    async.waterfall([
      registerUserMongo,
      registerUserES,
      createToken,
      getToken
    ], function(error, result) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json({
          _id: result._id,
          email: result.email,
          username: result.username,
          token: result.token.token,
          reputation: result.reputation,
          profileImage: result.profileImage,
          DATE_CREATED: result.FORMATTED_DATE,
        });
      }
    });
  }
};
