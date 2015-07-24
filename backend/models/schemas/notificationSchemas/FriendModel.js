exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var friendSchema = new Schema({
    usernameWaitFriendRequest: {
        type: String,
        index: true,
        required: false
    },
    usernameAcceptedFriendRequest: {
        type: String,
        index: true,
        required: false
    },
    DATE_CREATED: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: Date,
    updated: [Date],
    slug: {
        type: String,
        lowercase: true,
        trim: true
    }
  });

  /**
   * Pre hook.
   */
  friendSchema.pre('save', function(next, done) {
    console.log('***************presave friend*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  /**
   * Statics
   */
  friendSchema.statics = {
    load: function(id, cb) {
      console.log('*****************load friend******************');
      console.log(id);
      this.findOne({
          _id: id
      }).populate('creator').exec(cb);
    },
    saveFriend: function(idUser, username, cb) {
      console.log(idUser);
      this.findOneAndUpdate({
        $and: [
        {creator: idUser},
        {usernameWaitFriendRequest: username}
        ]
      }, {
        usernameAcceptedFriendRequest: username,
      }, {upsert: true}).exec(function(err, userOne) {
        if (err) {
          return cb(err);
        } else {
          return cb(null);
        }
      });
    },

    testIfFriendRequestDone: function(userId, cb) {
      this.findOne({
        creator: userId
      }).exec(function(err, result) {
        if (result && result.length > 0) {
          return cb(false);
        } else {
          return cb(true);
        }
      });
    },
  };

  mongoose.model('Friend', friendSchema);
};
