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
      }
  };

  /**
   * Methods
   */
  friendSchema.methods.expressiveQuery = function(creator, date, callback) {
    console.log('--------friends expressiveQuery-----------------');
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  mongoose.model('Friend', friendSchema);
};
