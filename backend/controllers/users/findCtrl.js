/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var path         = require('path');
var User         = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // SEARCH USER //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  search: function(req, res) {
    console.log('////////////////SEARCH////////////////////');
    var username;
    if (req.query.term) {
      username = req.user ? req.user.username : '';
      var search = req.query.term.toLowerCase();
      User.findUser(username, function(err, users) {
        if (err) {
          console.log('ERREUR');
          res.status(400).json(err);
        } else {
          res.status(200).json(users.filter(function(value) {
            return value[0].indexOf(search) !== -1;
          }));
        }
      });
    } else {
      res.status(200).end();
    }
  },

  /////////////////////////////////////////////////////////////////
  // CHECK USER EXIST /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  userExist: function(req, res) {
    var username = req.query.u;
    User.find({
      'username': username
    }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.status(ok ? 200 : 400).json({
              ok: ok
        });
      }, 400);
    });
  },

  /////////////////////////////////////////////////////////////////
  // CHECK EMAIL EXIST ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  emailExist: function(req, res) {
    console.log('emailExist');
    var email = req.query.u;
    User.find({
        'email': email
    }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.status(ok ? 200 : 400).json({
            ok: ok
        });
      }, 500);
    });
  },

};