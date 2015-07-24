/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var passport = require('passport');
var ee       = require('../../config/event');
var async    = require('async');

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
            res.status(err ? 400 : 200).json(err ?
              {err: 'Issue finding user.'} :
              true);
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
        return res.status(400).json({
          err: info.message
        });
      } else {
        console.log('user === true');
        console.log(user);
        req.user = user;
        next();
      }
    })(req, res);
  },

  authenticate: function(req, res) {

    function createToken(createTokenCallback) {
      User.createUserToken(req.user.email, function(err, userToken) {
        createTokenCallback(err ? err : null, userToken);
      });

    }

    function getToken(userToken, getTokenCallback) {
      User.getUserToken(req.user.email, userToken, function(err, user) {
        getTokenCallback(err ? err : null, user);
      });

    }

    // Faire une promise
    async.waterfall([createToken, getToken], function(error, result) {
      console.log(result);
      res.status(error ? 400 : 200).json(error ? error : {
        _id: result._id,
        email: result.email,
        username: result.username,
        token: result.token.token,
        reputation: result.reputation,
        profileImage: result.profileImage,
        DATE_CREATED: result.FORMATTED_DATE
      });
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
          registerUserMongoCallback(error ? error : null, result);
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
        registerUserMongoCallback(error ? error : null);
      });
    }

    function createToken(createTokenCallback) {

      User.createUserToken(req.body.email, function(err, usersToken) {
        createTokenCallback(err ? err : null, usersToken);
      });

    }

    function getToken(usersToken, getTokenCallback) {
      User.getUserToken(req.body.email, usersToken, function(err, user) {
        getTokenCallback(err ? err : null, user);
      });
    }

    // Faire une promise
    async.waterfall([
      registerUserMongo,
      registerUserES,
      createToken,
      getToken
    ], function(error, result) {
      res.status(error ? 400 : 200).json(error ? error : {
        _id: result._id,
        email: result.email,
        username: result.username,
        token: result.token.token,
        reputation: result.reputation,
        profileImage: result.profileImage,
        DATE_CREATED: result.FORMATTED_DATE,
      });
    });
  }
};
