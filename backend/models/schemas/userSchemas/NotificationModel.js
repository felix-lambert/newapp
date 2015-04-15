exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var notificationSchema = new Schema({
      userRec: String,
      userDes: String,
      userId: String,
      reset: String,
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
        console.log(id);
        this.findOne({
            _id: id
        }).populate('creator').exec(cb);
      },

      findUserNotifications : function(user, cb) {
        var sendNotifications = [];
        this.find(user)
          .sort('-created')
          .populate('creator', 'username facebook.username ' +
            'google.username linkedIn.username')
          .exec(function(err, notifications) {
            if (err) {
              cb(err, null);
            }
            for (i = 0; i < notifications.length; i++) {
              sendNotifications.push({
                userDes: notifications[i].userDes,
                userRec : notifications[i].userRec,
                userId: notifications[i].userId,
                reset: notifications[i].reset,
                id: notifications[i]._id
              });
            }
            cb(false, sendNotifications);
          });
      }
  };

  /**
   * Methods
   */
  notificationSchema.methods.expressiveQuery = function(creator, date, callback) {
    console.log('--------friends expressiveQuery-----------------');
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  mongoose.model('Notification', notificationSchema);
};
