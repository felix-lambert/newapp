var Q            = require('q');
var moment       = require('moment');
var autopopulate = require('mongoose-autopopulate');
var mongoosastic = require('../../mongoosastic');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  announceSchema = new Schema({
    title: {
      type: String,
      es_boost:2.0,
      required: true,
    },
    nbComment: Number,
    tags: [String],
    type: {
      type: String,
      required: false
    },
    likeCreator: {
      type: Schema.ObjectId,
      ref: 'Like'
    },
    activated: Boolean,
    category: String,
    rating: {
      type: Number,
      max: 5,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    status: {
      type: Number,
      default: 1,
    },
    FORMATTED_DATE: String,
    created: Date,
    updated: [Date],
    timeSave: String,
    creator: {
      type: Schema.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    creatorUsername: {
      type: Schema.ObjectId,
      ref: 'Username',
      autopopulate: true
    },
    price: {
      type: Number,
      min : 1,
    }
  });
  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    var FORMATTED_DATE;
    if (this.isNew) {
      this.created        = Date.now();
      FORMATTED_DATE      = moment(this.DATE_CREATED).format('DD/MM/YYYY, hA:mm');
      this.FORMATTED_DATE = FORMATTED_DATE;
    }
    this.updated.push(Date.now());
    FORMATTED_DATE      = moment(this.DATE_CREATED).format('DD/MM/YYYY, hA:mm');
    this.FORMATTED_DATE = FORMATTED_DATE;
    next();
  });

  /////////////////////////////////////////////////////////////////
  // STATICS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.statics = {

    organizeAnnounceData: function(announce, cb) {
      var username     = announce.creator ?
      announce.creator.username :
      announce.creatorUsername.username;
      var creatorId    = announce.creator ?
      announce.creator :
      announce.creatorUsername;
      var profileImage = announce.creator ?
      announce.creator.profileImage :
      announce.creatorUsername.profileImage;
      var announcePost = {
        _id: announce._id,
        created: announce.created,
        creator: {
            _id: creatorId,
            username: username,
            profileImage: profileImage
        },
        title: announce.title,
        category: announce.category,
        type: announce.type,
        slug: announce.slug,
        __v: announce.__v,
        updated: announce.updated,
        content: announce.content,
        rating: announce.rating,
        status: announce.status,
        price: announce.price,
        activated: announce.activated,
        tags: announce.tags
      };
      return cb(announcePost);
    },

    load: function(id, cb) {
      console.log('*****************load announce******************');
      this.findOne({
          _id: id
      }).exec(cb);
    },

    findByTitle: function(title, callback) {
      console.log('find annonce by title');
      return this.find({
        title: title
      }, callback);
    },
  };

  /**
   * Methods
   */
  announceSchema.methods.expressiveQuery = function(creator, date, callback) {
    console.log('-----------expressiveQuery------------------');
    return this.find('creator', creator).where('date').gte(date).run(callback);
  };

  /////////////////////////////////////////////////////////////////
  // PLUGINS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  function slugGenerator(options) {
    options = options || {};
    var key = options.key || 'title';

    return function slugGenerator(schema) {
      schema.path(key).set(function(v) {
        this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
        return v;
      });
    };
  }

  announceSchema.plugin(mongoosastic);

  announceSchema.plugin(slugGenerator());


  announceSchema.plugin(autopopulate);
  /////////////////////////////////////////////////////////////////
  // create the model for announce and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Announce', announceSchema);
};
