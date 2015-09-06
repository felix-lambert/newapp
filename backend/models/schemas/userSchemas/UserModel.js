var chalk     = require('chalk');
var elasticsearch = require('elasticsearch');

exports = module.exports = function(mongoose) {

  if (process.env.NODE_ENV === 'production') {
    var ES = new elasticsearch.Client({
      host: "http://paas:f669a84c8a68e09959b4e8e88df26bf5@dwalin-us-east-1.searchly.com"
    });
  } else {
    var ES = new elasticsearch.Client({
      host: "localhost:9200"
    });
  }

  ES.indices.create({
    index: "user",
    body: {
      "settings": {
        "number_of_shards": 1, 
        "analysis": {
            "filter": {
                "autocomplete_filter": { 
                    "type":     "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 20
                }
            },
            "analyzer": {
                "autocomplete": {
                    "type":      "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "autocomplete_filter" 
                    ]
                }
            }
        }
    }
  }
}, function(err,resp,respcode){
   console.log(chalk.blue('create index...'));
    console.log(err,resp,respcode);
    
    ES.indices.putMapping({
      index: 'user', 
      type: 'usr',
      body:{ 'usr': {
            "properties": {
                "username": {
                    "type":     "string",
                    "analyzer": "autocomplete"
                }
            }
        }
      } }, function(err, resp, respcode) {
        console.log(chalk.blue('create index...'));
    });
});

  /*
   * Module dependencies
   */
  var Schema                = mongoose.Schema;
  var Token                 = mongoose.model('Token');
  var moment                = require('moment');
  var jwt                   = require('jwt-simple');
  var passportLocalMongoose = require('passport-local-mongoose');
  var tokenSecret           = 'bloc';

  var UserSchema = new Schema({
    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
      index: {
        unique: true
      }
    },
    anonymUsername: String,
    token: {
      type: Object
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: String,
    DATE_CREATE: {
      type: Date,
      default: Date.now
    },
    reputation: {
      type: Number,
      max: 5
    },
    profileImage: {
      type: String
    },
    salt: String,
    guest: Boolean,
    provider: String,
    locked: Boolean,
    money: {
      type: Number,
      min:0
    },
    created: Date,
    FORMATTED_DATE: Date
  });

  UserSchema.statics = {

    createUserToken: function(email, cb) {
      var self = this;
      this.findOne({email: email}, function(err, usr) {
        if (err || !usr) {
          console.log('err');
        }
        var token = self.encode({email: email});
        usr.token = new Token({token:token});
        usr.save(function(err, usr) {
          console.log(usr.token.token);
          cb(err ? err : false, usr.token.token);
        });
      });
    },

    createImage: function(email, name, cb) {
      var self = this;
      this.findOne({email: email}, function(err, user) {
        if (err || !user) {
          console.log('err');
        } else {
          user.images.push({name: name});
          user.save(function(err, result) {
            cb(err ? err : false, user.images);
          });
        }
      });
    },

    getUserImages: function(email, cb) {
      var self = this;
      this.findOne({email: email}).exec(function(err, user) {
        if (err || !user) {
          cb(err, null);
        } else if (user.images) {
          FORMATTED_DATE      = moment(user.DATE_CREATED).format('DD/MM/YYYY');
          user.FORMATTED_DATE = FORMATTED_DATE;
          cb(false, user.images);
        } else {
          cb(false, user.images);
        }
      });
    },
    
    getUserFromToken: function(email, token, cb) {
      var self = this;
      self.findOne({email: email})
      .exec(function(err, usr) {
        if (err || !usr) {
          console.log('ERROR');
          cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
          FORMATTED_DATE     = moment(usr.DATE_CREATED).format('DD/MM/YYYY');
          usr.FORMATTED_DATE = FORMATTED_DATE;
          cb(false, usr);
        } else {
          cb(false, usr);
        }
      });
    },

    encode: function(data) {
      return jwt.encode(data, tokenSecret);
    },

    decode: function(data, cb) {
      try {
        var decoded = jwt.decode(data, tokenSecret);
        var self = this;
        self.findOne({email: decoded.email})
        .exec(function(err, user) {
          if (err || !user) {
            cb(err, null);
          } else if (user.token && user.token.token) {
            FORMATTED_DATE     = moment(user.DATE_CREATED).format('DD/MM/YYYY');
            user.FORMATTED_DATE = FORMATTED_DATE;
            cb(false, user);
          } else {
            cb(false, user);
          }
        });
      } catch (err) {
        return cb('Invalide Token');
      }
    },

    emailExist: function(email, cb) {
      this.findOne(email, function(err, usr) {
        if (err || !usr) {
          cb(false);
        } else {
          cb(true);
        }
      });
    },

    invalidateUserToken: function(data, cb) {
      var self = this;
      console.log('invalidateUserToken');
      var decoded = jwt.decode(data, tokenSecret);
      this.findOne({email: decoded.email}, function(err, usr) {
        if (err || !usr) {
          console.log('err');
        }
        usr.token = null;
        usr.save(function(err, usr) {
          cb(err ? err : false, err ? null : 'removed');
        });
      });
    }
};

  UserSchema.plugin(passportLocalMongoose, {
    iterations : 1, 
    usernameQueryFields : ['email'],
    usernameLowerCase: true
  });

  // create the model for User and expose it to our app
  mongoose.model('User', UserSchema);
};
