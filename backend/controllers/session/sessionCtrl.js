/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var passport = require('passport');
var async    = require('async');
var moment   = require('moment');
var elasticsearch = require('elasticsearch');
var chalk     = require('chalk');

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

  /////////////////////////////////////////////////////////////////
  // LOGOUT ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  logout: function(req, res) {
    console.log(chalk.blue('******************logout******************'));
    var incomingToken = req.headers['auth-token'];
    if (incomingToken) {
      User.invalidateUserToken(incomingToken, function(err, user) {
        res.status(err ? 400 : 200).json(err ?
          {err: 'Issue finding user.'} : true);
      });
    } else {
      console.log(chalk.red('Issue decoding incoming token.'));
      res.status(400).json({error: 'Issue decoding incoming token.'});
    }
  },

  /////////////////////////////////////////////////////////////////
  // AUTHENTICATE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  passportAuthenticate: function(req, res, next) {
    console.log(chalk.blue('Authenticate'));

    User.authenticate()(req.body.email, req.body.password, function(err, user, message) {
      console.log(err, user, message);
      if (user === false) {
        console.log(chalk.red(err));
        return res.status(400).json({
          err: message.message
        });
      } else {
        console.log(chalk.green(user));
        req.user = user;
        next();
      }
    });
  },

  authenticate: function(req, res) {

    function createToken(createTokenCallback) {
      console.log('createToken');
      User.createUserToken(req.user.email, function(err, userToken) {
        createTokenCallback(err ? err : null, userToken);
      });

    }

    function getToken(userToken, getTokenCallback) {
      console.log('getToken');
      User.getUserFromToken(req.user.email, userToken, function(err, user) {
        getTokenCallback(err ? err : null, user);
      });

    }

    // Faire une promise
    async.waterfall([createToken, getToken], function(error, result) {
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
    console.log(chalk.blue('**********************Register***********************'));

    function registerUserMongo(registerUserMongoCallback) {
      console.log(req.body);
      if (req.body.password === req.body.repeatPassword) {
        if (req.body.username === undefined || req.body.email === undefined) {
          console.log(chalk.red('There is no username or email'));
          return registerUserMongoCallback('There is no username or email');
        }
        var user = new User({
          username: req.body.username,
          email: req.body.email,
          profileImage: null,
        });
        User.register(user, req.body.password, function(error, result) {
          registerUserMongoCallback(error ? error : null, result);
        });
      } else {
        console.log(chalk.red('The confirm password does not match'));
        registerUserMongoCallback('The confirm password does not match');
      }
    }

    function registerUserES(user, registerUserESCallback) {
      var FORMATTED_DATE;
      ES.create({
        index: 'user',
        type: 'usr',
        id: user._id.toHexString(),
        body: {
          created: Date.now(),
          username: user.username,
          profileImage: null
        }}, function(err, res) {
          registerUserESCallback(err ? err : null);
        });
    }

    function createToken(createTokenCallback) {
      console.log(req.body.email);
      User.createUserToken(req.body.email, function(err, usersToken) {
        return createTokenCallback(err ? err : null, usersToken);
      });

    }

    function getToken(usersToken, getTokenCallback) {
      User.getUserFromToken(req.body.email, usersToken, function(err, user) {
        return getTokenCallback(err ? err : null, user);
      });
    }

    // Faire une promise
    async.waterfall([
      registerUserMongo,
      registerUserES,
      createToken,
      getToken
    ], function(error, result) {
      console.log(result);
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
