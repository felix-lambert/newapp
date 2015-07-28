exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var notificationSchema = new Schema({
    userRec: String,
    userDes: String,
    userId: String,
    type: String,
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
  notificationSchema.pre('save', function(next, done) {
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
  notificationSchema.statics = {
    load: function(id, cb) {
      console.log('*****************load notification******************');
      this.findOne({
          _id: id
      }).populate('creator').exec(cb);
    },

    findUserNotifications : function(user, cb) {
      var sendNotifications = [];
      this.find(user)
        .sort('-created')
        .populate('creator')
        .exec(function(err, notifications) {
          if (err) {
            cb(err, null);
          } else {
            notifications.forEach(function(item) {
              sendNotifications.push({
                userDes: item.userDes,
                userRec : item.userRec,
                userId: item.userId,
                id: item._id,
                type: item.type
              });
            });
            cb(false, sendNotifications);
          }
        });
    }
  };

  mongoose.model('Notification', notificationSchema);
};
