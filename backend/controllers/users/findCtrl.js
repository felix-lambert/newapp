/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var ee       = require('../../config/event');

module.exports = {

  show: function(req, res, next) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    var userId = req.params.id;
    User.findById(userId, function(err, user) {
      res.status(err ? 400 : 200).json(err ? 'Failed to load User' : user);
    });
  },

  ////////////////////////////////////////////////////////////////
  // SEARCH USER //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  search: function(req, res) {
    if (req.query.term) {
      var username = req.user ? req.user.username : '';
      var search   = req.query.term.toLowerCase();
      User.search({
        query:{
          'multi_match': {
            'fields':  ['username'],
              'query': search,
              'fuzziness': 'AUTO'
          }
        }}, function(err, users) {
          res.status(err ? 400 : 200).json(err ? err : users.hits.hits);
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
    if (username) {
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
    } else {
      res.status(400).json();
    }
  },

  /////////////////////////////////////////////////////////////////
  // CHECK EMAIL EXIST ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  emailExist: function(req, res) {
    console.log('test');
    if (req.query.u) {
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
    } else {
      res.status(400).json();
    }
  }

};
