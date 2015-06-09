exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;

  var messageSchema = new Schema({
      type: {
          type: String,
          required: false
      },
      user: {
        type: String,
        default: '',
        trim: true
      },
      content: {
          type: String,
          default: '',
          trim: true
      },
      slug: {
          type: String,
          lowercase: true,
          trim: true
      },
      created: Date,
      updated: [Date],
      roomCreator: {
          type: Schema.ObjectId,
          ref: 'Room'
      },
      userRec: {
          type: String
      },
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  messageSchema.pre('save', function(next, done) {
    console.log('_________________presave message____________________');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  /////////////////////////////////////////////////////////////////
  // STATICS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  messageSchema.statics = {
    load: function(id, cb) {
      console.log('*****************load message******************');
      this.findOne({
          _id: id
      }).populate('userCreator roomCreator').exec(cb);
    },

    findByContent: function(content, callback) {
      return this.find({
          content: content
      }, callback);
    }
  };

  /////////////////////////////////////////////////////////////////
  // METHODS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  messageSchema.methods.expressiveQuery = function(creator, date, callback) {
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  /////////////////////////////////////////////////////////////////
  // PLUGINS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  function slugGenerator(options) {
    console.log('slug generator');
    options = options || {};
    var key = options.key || 'content';

    return function slugGenerator(schema) {
      schema.path(key).set(function(v) {
        this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
        return v;
      });
    };
  }

  messageSchema.plugin(slugGenerator());

  /////////////////////////////////////////////////////////////////
  // create the model for message and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Message', messageSchema);
};
