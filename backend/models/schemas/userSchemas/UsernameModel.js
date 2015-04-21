exports = module.exports = function(mongoose) {

  var Schema      = mongoose.Schema;
  var Token       = mongoose.model('Token');
  var jwt         = require('jwt-simple');
  var tokenSecret = 'bloc';
  var moment      = require('moment');

  var usernameSchema = new Schema({
      username: String,
      DATE_CREATED: {
          type: Date,
          default: Date.now
      },
      token: {
        type: Object
      },
      created: Date,
      updated: [Date],
      slug: {
          type: String,
          lowercase: true,
          trim: true
      },
      profileImage: {
        type: Schema.ObjectId,
        ref: 'Image'
      },
      reputation: {
        type: Number,
        max: 5
      },
      guest: Boolean,
      joinedSocketServer: Boolean,
      provider: String,
      money: {
        type: Number,
        min:0
      }
  });

  /**
   * Pre hook.
   */
  usernameSchema.pre('save', function(next, done) {
    console.log('***************presave username*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  /**
   * Statics
   */
  usernameSchema.statics = {
      load: function(id, cb) {
        console.log('*****************load username******************');
        console.log(id);
        this.findOne({
            _id: id
        }).populate('creator').exec(cb);
      },

      createUsernameToken: function(username, cb) {
        var self = this;
        this.findOne({username: username}, function(err, user) {
          if (err || !user) {
            console.log('err');
          }
          var token = self.encode({username: username});
          user.token = new Token({token:token});
          user.save(function(err, user) {
            if (err) {
              cb(err, null);
            } else {
              cb(false, user.token.token);
            }
          });
        });
      },

      findUsername: function(username, cb) {
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

      getUsernameToken: function(username, token, cb) {
        var self = this;
        this.findOne({username: username}).exec(function(err, user) {
          console.log('get user token');
          if (err || !user) {
            console.log('ERROR');
            cb(err, null);
          } else if (user.token &&
            user.token.token &&
            token === user.token.token) {
            FORMATTED_DATE = moment(user.DATE_CREATED).format('DD/MM/YYYY');
            user.FORMATTED_DATE = FORMATTED_DATE;
            cb(false, user);
          } else {
            cb(new Error('Token does not exist or does not match.'), null);
          }
        });
      },

      encode: function(data) {
        return jwt.encode(data, tokenSecret);
      },

      decode: function(data) {
        return jwt.decode(data, tokenSecret);
      },

      invalidateUsernameToken: function(username, cb) {
        var self = this;
        this.findOne({username: username}, function(err, user) {
          if (err || !user) {
            console.log('err');
          }
          user.token = null;
          user.save(function(err, user) {
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
   * Methods
   */
  usernameSchema.methods.expressiveQuery = function(creator, date, callback) {
    console.log('--------friends expressiveQuery-----------------');
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  mongoose.model('Username', usernameSchema);
};
