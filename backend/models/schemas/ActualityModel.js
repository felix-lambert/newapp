exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var actualitySchema = new Schema({
    content: String,
    status: Number,
    creator: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    likeCreator: {
      type: Schema.ObjectId,
      ref: 'Like'
    },
    date: {
        type: Date,
        default: Date.now
    },
    updated: [Date]
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  actualitySchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  mongoose.model('Actuality', actualitySchema);
};
