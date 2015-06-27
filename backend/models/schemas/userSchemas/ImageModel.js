exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var imageSchema = new Schema({
      name: String,
      profileImage: Boolean,
      date: {
          type: Date,
          default: Date.now
      },
      updated: [Date],
      creator: {
        type: Schema.ObjectId,
        ref:'User'
      },
      creatorUsername: {
        type: Schema.ObjectId,
        ref: 'Username'
      },
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  imageSchema.pre('save', function(next, req, callback) {
    console.log('***************presave image*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  mongoose.model('Image', imageSchema);
};
