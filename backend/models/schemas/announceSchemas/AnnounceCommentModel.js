exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var announceCommentSchema = new Schema({
      content: String,
      rating: Boolean,
      creator: {
          type: Schema.ObjectId,
          ref: 'User'
      },
      creatorUsername: {
          type: Schema.ObjectId,
          ref: 'Username'
      },
      date: {
          type: Date,
          default: Date.now
      },
      updated: [Date],
      announce: {
          type: Schema.ObjectId,
          ref: 'Announce'
      }
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceCommentSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  mongoose.model('AnnounceComment', announceCommentSchema);
};
