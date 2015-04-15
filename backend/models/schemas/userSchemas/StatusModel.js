exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var statusSchema = new Schema({
      content: String,
      author: {
          type: Schema.ObjectId,
          ref: 'User'
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
  statusSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  mongoose.model('Status', statusSchema);
};
