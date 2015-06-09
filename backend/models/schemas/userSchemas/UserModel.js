exports = module.exports = function(mongoose) {

  /*
   * Module dependencies
   */
  var Token                 = mongoose.model('Token');
  var moment                = require('moment');
  var jwt                   = require('jwt-simple');
  var Schema                = mongoose.Schema;
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
    username: {
      type: String,
      unique: true,
      sparse: true
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
    token: {
      type: Object
    },
    images: [String],
    salt: String,
    guest: Boolean,
    provider: String,
    locked: Boolean,
    money: {
      type: Number,
      min:0
    }
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
          if (err) {
            cb(err, null);
          } else {
            cb(false, usr.token.token);
          }
        });
      });
    },

    findUser: function(username, cb) {
      this.find().exec(function(err, user) {
        if (err) {
          console.log('erreur : ' + err);
          cb(err, null);
        } else {
          var filter = [];
          for (var i = 0; i < user.length; i++) {
            if (user[i].username && user[i].username !== username) {
              filter.push([user[i].username, user[i]._id]);
            }
          }
          cb(false, filter);
        }
      });
    },

    getUserToken: function(email, token, cb) {
      var self = this;
      this.findOne({email: email})
      .exec(function(err, usr) {
        if (err || !usr) {
          console.log('ERROR');
          cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
          FORMATTED_DATE = moment(usr.DATE_CREATED).format('DD/MM/YYYY');
          usr.FORMATTED_DATE = FORMATTED_DATE;
          cb(false, usr);
        } else {
          // cb(new Error('Token does not exist or does not match.'), null);
          cb(false, usr);
        }
      });
    },

    encode: function(data) {
      return jwt.encode(data, tokenSecret);
    },

    decode: function(data) {
      return jwt.decode(data, tokenSecret);
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

    invalidateUserToken: function(email, cb) {
      var self = this;
      console.log('invalidateUserToken');
      this.findOne({email: email}, function(err, usr) {
        if (err || !usr) {
          console.log('err');
        }
        usr.token = null;
        usr.save(function(err, usr) {
          if (err) {
            cb(err, null);
          } else {
            cb(false, 'removed');
          }
        });
      });
    }
};

  /**
   * Virtuals
   */
  UserSchema
   .virtual('USER_INFO')
   .get(function() {
    console.log('*************USER INFO*************');
    return {
      '_id': this._id,
      'username': this.username,
      'email': this.email,
      'images': this.images
    };
  });

  UserSchema.methods = {
    calculateReputation: function(callback) {
      console.log('_____calculateReputation_____________________');
      var Announce = mongoose.model('Announce');
      Announce.find({
        creator: this
      }, function(err, ann) {
        if (err) {
          return callback(null);
        }
        var key = 0;
        var value = 0;
        var rated = 0;
        for (key in ann) {
          if (ann[key].rating) {
            value += parseInt(ann[key].rating);
            rated++;
          }
        }
        var reput = null;
        if (value && rated) {
          reput = (value / rated).toPrecision(2);
        }
        return (callback({
          total: ann.length,
          rated: rated,
          reputation: reput
        }));
      });
    },
  };

  UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true
  });

  // create the model for User and expose it to our app
  mongoose.model('User', UserSchema);
};
