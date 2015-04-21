/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Username = mongoose.model('Username');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET SESSION //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getSession: function(req, res) {
    console.log('***** auth/session callback *****');
    res.status(201).json('authentified');
  },

  /////////////////////////////////////////////////////////////////
  // LOGOUT ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  logout: function(req, res) {
    console.log('******************logout******************');
    var incomingToken = req.headers['auth-token'];
    console.log(incomingToken);
    if (incomingToken) {
      var decoded = User.decode(incomingToken);
      if (decoded && decoded.email) {
        User.invalidateUserToken(decoded.email, function(err, user) {
          if (err) {
            res.status(400).json({error: 'Issue finding user.'});
          } else {
            res.status(200).end();
          }
        });
      } else if (decoded && decoded.username) {
        Username.invalidateUsernameToken(decoded.username, function(err, user) {
          if (err) {
            res.status(400).json({error: 'Issue finding user.'});
          } else {
            res.status(200).end();
          }
        });
      } else {
        res.status(400).json({error: 'Issue decoding incoming token.'});
      }
    } else {
      res.redirect('/');
    }
  },

  /////////////////////////////////////////////////////////////////
  // AUTHENTICATE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  authenticate: function(req, res) {
    console.log('authenticate');
    if (req.user) {
      User.createUserToken(req.user.email, function(err, usersToken) {
        if (err) {
          res.status(400).json({error: 'Issue generating token'});
        } else {
          User.getUserToken(req.user.email, usersToken, function(err, usr) {
            if (err) {
              console.log(err);
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
    } else {
      res.status(400).json({
          error: 'AuthError'
      });
    }
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
          console.log('error while user register!', error);
          return res.status(400).json(error);
        }
        User.createUserToken(req.body.email, function(err, usersToken) {
          if (err) {
            res.status(400).json({error: 'Issue generating token'});
          } else {
            User.getUserToken(req.body.email, usersToken, function(err, user) {
              if (err) {
                console.log(err);
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
    }
  }
};
