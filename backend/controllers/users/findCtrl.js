/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var chalk     = require('chalk');
var util = require('util');
var Friend   = mongoose.model('Friend');

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

function arrayIndexOf(myArray, searchTerm) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i] === searchTerm) {
      return i;
    }
  }
  return -1;
}


module.exports = {

  show: function(req, res, next) {
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
      console.log(chalk.blue('search'));

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
      var usernames = resp.hits.hits;
      Friend.find({creator: req.user._id})
      .sort('-created')
      .exec(function(err, friends) {
        var friendsUsernames = [];
        var usernames = resp.hits.hits;
        if (err) {
          return res.status(501).json(err);
        } else {
          var i = 0;
          friends.forEach(function(item) {
            friendsUsernames[i] = item.usernameAcceptedFriendRequest ? item.usernameAcceptedFriendRequest :
            item.usernameWaitFriendRequest;
            i++;
          });
          usernames.forEach(function(user) {
            if (user._source.username === req.user.username) {
              user.username = {'yourself': user._source.username};
            } else {
                user.username = arrayIndexOf(friendsUsernames, user._source.username) < 0 ?
                {
                  'follow': user._source.username,
                  'friendId': user._id,
                } : {
                  'notFollow': user._source.username
                };
                if (user.username.notFollow) {
                  friends.forEach(function(friend) {
                    if (user.username.notFollow === friend.usernameWaitFriendRequest) {
                      user.username.notFollow = {'wait' : friend.usernameWaitFriendRequest};
                    } else if (user.username.notFollow === friend.usernameAcceptedFriendRequest) {
                      user.username.notFollow = {'accept' : friend.usernameAcceptedFriendRequest};
                    }
                  });
                }
              }
          });
          return res.status(200).json(usernames);
        }
      });
    });
    } else {
      return res.status(200).end();
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
