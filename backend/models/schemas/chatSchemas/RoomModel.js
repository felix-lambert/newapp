exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var roomSchema = new Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    people: [String],
    created: Date,
    updated: [Date],
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  roomSchema.pre('save', function(next, done) {
    console.log('***************presave room*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  /**
   * Statics
   */
  roomSchema.statics = {
    load: function(id, cb) {
      console.log('*****************load room******************');
      this.findOne({
          _id: id
      }).populate('creator').exec(cb);
    },
    findByTitle: function(title, callback) {
      console.log('find room by title');
      return this.find({
          title: title
      }, callback);
    },
  };

  /**
   * Methods
   */
  roomSchema.methods.expressiveQuery = function(creator, date, callback) {
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  /////////////////////////////////////////////////////////////////
  // create the model for room and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Room', roomSchema);
};
