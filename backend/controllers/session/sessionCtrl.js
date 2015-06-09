/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Username = mongoose.model('Username');
var passport = require('passport');
var ee       = require('../../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // LOGOUT ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  logout: function(req, res) {
    console.log('******************logout******************');
    var incomingToken = req.params.id;
    if (incomingToken) {
      var decoded = User.decode(incomingToken);
      if (decoded.email) {
        var decodeUser = decoded.email;
        User.invalidateUserToken(decodeUser,
          function(err, user) {
          if (err) {
            ee.emit('error', err);
            res.status(400).json({error: 'Issue finding user.'});
          } else {
            res.redirect('/');
          }
        });
      } else if (decoded.username) {
        var decodeUser = decoded.username;
        Username.invalidateUsernameToken(decodeUser,
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
    passport.authenticate('local', {session: false}, function(err, user, info) {
      if (user === false) {
        return res.status(400).json({
          err: info.message
        });
      } else {
        req.user = user;
        next();
      }
    })(req, res);
  },

  authenticate: function(req, res) {
    console.log('authenticate');
    User.createUserToken(req.user.email, function(err, usersToken) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json({error: 'Issue generating token'});
      } else {
        User.getUserToken(req.user.email, usersToken, function(err, usr) {
          if (err) {
            ee.emit('error', err);
            res.status(400).json({error: 'Issue finding user.'});
          } else {
            res.status(200).json({
              _id: usr._id,
              email: usr.email,
              username: usr.username,
              token: usr.token.token,
              reputation: usr.reputation,
              profileImage: usr.profileImage,
              DATE_CREATED: usr.FORMATTED_DATE,
            });
          }
        });
      }
    });
  },
  /////////////////////////////////////////////////////////////////
  // REGISTER /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  register: function(req, res, next) {
    console.log('**********************Register***********************');
    if (req.body.password === req.body.confPassword) {
      var user = new User({
        username: req.body.username,
        email: req.body.email
      });
      User.register(user, req.body.password, function(error) {
        if (error) {
          ee.emit('error', error);
          return res.status(400).json(error);
        }
        User.createUserToken(req.body.email, function(err, usersToken) {
          if (err) {
            ee.emit('error', err);
            res.status(400).json({error: 'Issue generating token'});
          } else {
            User.getUserToken(req.body.email, usersToken, function(err, user) {
              if (err) {
                ee.emit('error', err);
                res.status(400).json({error: 'Issue finding user'});
              } else {
                res.status(200).json({
                _id: user._id,
                email: user.email,
                username: user.username,
                token: user.token.token,
                reputation: user.reputation,
                profileImage: user.profileImage,
                DATE_CREATED: user.FORMATTED_DATE,
              });
              }
            });
          }
        });
      });
    } else {
      res.status(400).json('The confirm password don\'t match');
    }
  }
};
