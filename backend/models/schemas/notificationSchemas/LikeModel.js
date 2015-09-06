var autopopulate = require('mongoose-autopopulate');

exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var likeSchema = new Schema({
    userSend: String,
    userRec: String,
    DATE_CREATED: {
      type: Date,
      default: Date.now
    },
    creator: {
      type: Schema.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    created: Date,
    updated: [Date],
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    likeType: String
  });

  /**
   * Pre hook.
   */
  likeSchema.pre('save', function(next, done) {
    console.log('***************presave like*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  likeSchema.plugin(autopopulate);

  mongoose.model('Like', likeSchema);
};
