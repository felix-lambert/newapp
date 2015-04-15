/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose         = require('mongoose');
var User             = mongoose.model('User');
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var Token            = mongoose.model('Token');

module.exports = {
  /////////////////////////////////////////////////////////////////
  // GOOGLE PASSPORT //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  googleStrategy: function(config) {
    'use strict';
    return new GoogleStrategy({
      clientID: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: config.auth.google.callback
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.email': profile._json.email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        console.log('************' + user + '**');
        var find = {
          'google.email': profile._json.email
        };
        if (!user || user === null) {
          var newUser = new User();
          newUser.google.username = profile._json.name;
          newUser.google.email = profile._json.email;
          newUser.token = new Token({
            token: accessToken
          });
          newUser.role = 'user';

          newUser.save(function(err) {
            if (err) {
              console.log(err);
              return res.status(400).send(err);
            }
            return done(null, newUser);
          });
        } else {
          user.token = new Token({
            token: accessToken
          });
          user.save(function(err) {
            if (err) {
              console.log(err);
            }
            return done(null, user);
          });
        }
      });
    });
  },
  /////////////////////////////////////////////////////////////////
  // LINKEDIN PASSPORT ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  linkedInStrategy: function(config) {
    'use strict';
    return new LinkedInStrategy({
            clientID: config.auth.linkedIn.clientId,
            clientSecret: config.auth.linkedIn.clientSecret,
            callbackURL: config.auth.linkedIn.callback,
            scope: ['r_emailaddress', 'r_basicprofile', 'rw_nus']
        },
        function(token, tokenSecret, profile, done) {
          console.log('*************INSIDE PASSPORT**************');
          User.findOne({
              'linkedIn.email': profile.emails[0].value
          }, function(err, user) {
            if (err) {
              return done(err);
            }
            var find = {
              'linkedIn.email': profile.emails[0].value
            };
            var token;
            if (!user) {
              var newUser = new User();
              newUser.linkedIn.username = profile.displayName;
              newUser.linkedIn.email = profile.emails[0].value;
              token = uid(16);
              newUser.token = new Token({
                  token: token
              });
              newUser.role = 'user';
              newUser.save(function(err) {
                if (err) {
                  console.log(err);
                  return res.status(400).send(err);
                }
                return done(null, newUser);
              });
            } else {
              token = uid(16);
              user.token = new Token({
                  token: token
              });
              user.save(function(err) {
                if (err) {
                  console.log(err);
                }
                return done(null, user);
              });
            }
          });
        });
  },
  /////////////////////////////////////////////////////////////////
  // FACEBOOK PASSPORT ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  facebookStrategy: function(config) {
      'use strict';
      console.log('inside FacebookStrategy');
      return new FacebookStrategy({
              clientID: config.auth.facebook.clientId,
              clientSecret: config.auth.facebook.clientSecret,
              callbackURL: config.auth.facebook.callback
          },
          function(accessToken, refreshToken, profile, done) {
            User.findOne({
              'facebook.email': profile._json.email
            }, function(err, user) {
                console.log(user);
                if (err) {
                  return done(err);
                }
                var find = {
                    'facebook.email': profile._json.email
                };
                if (!user || user === null) {
                  var newUser = new User();
                  newUser.facebook.username = profile.displayName;
                  newUser.facebook.email = profile._json.email;
                  var token = accessToken;
                  newUser.token = new Token({
                      token: token
                  });
                  newUser.role = 'user';
                  newUser.save(function(err) {
                    if (err) {
                      console.log(err);
                      return res.status(400).send(err);
                    }
                    return done(null, newUser);
                  });
                } else {
                  user.token = new Token({
                      token: accessToken
                  });
                  user.save(function(err) {
                    if (err) {
                      console.log(err);
                    }
                    return done(null, user);
                  });
                }
              });
          });
    }
};
