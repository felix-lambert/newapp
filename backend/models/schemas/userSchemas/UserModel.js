exports = module.exports = function(mongoose) {

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
          console.log('_______________add image___________');
          user.images.push({name: name});
          console.log('___________________________________');
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
    
    getUserToken: function(email, token, cb) {
      var self = this;
      this.findOne({email: email})
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
          cb(err ? err : false, err ? null : 'removed');
        });
      });
    }
};

  UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameLowerCase: true
  });

  // create the model for User and expose it to our app
  mongoose.model('User', UserSchema);
};
