/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var elasticsearch = require("elasticsearch");

if (process.env.NODE_ENV === 'production') {
  var ES = new elasticsearch.Client({
    host: "http://paas:f669a84c8a68e09959b4e8e88df26bf5@dwalin-us-east-1.searchly.com"
  });
} else {
  var ES = new elasticsearch.Client({
    host: "localhost:9200"
  });
}

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
    console.log(req.params);
    if (req.query.term) {
      console.log('search');
      var username = req.user ? req.user.username : '';
      var search   = req.query.term.toLowerCase();
      ES.search({
      index: 'user',
      body: {
        'size' : 10,
        'query': {
          'match': {
            'username': search
          }
        }
      }
    }).then(function (resp) {
      console.log(resp);
      res.status(200).json(resp.hits.hits);
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
      res.status(400).json('No username is typed');
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
      res.status(400).json('No email is typed');
    }
  }

};
