var Q            = require('q');
var moment       = require('moment');
var autopopulate = require('mongoose-autopopulate');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  announceSchema = new Schema({
    title: {
        type: String,
        index: true,
        required: true
    },
    nbComment: Number,
    tags: [String],
    type: {
        type: String,
        required: false
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
        trim: true
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
        ref: 'User'
    },
    creatorUsername: {
        type: Schema.ObjectId,
        ref: 'Username'
    },
    creatorAnnounce: {
      type: Schema.ObjectId,
      ref: 'AnnounceComment'
    },
    price: {
      type: Number,
      min : 1,
    },
  });

  announceSchema.plugin(autopopulate);
  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    var FORMATTED_DATE;
    if (this.isNew) {
      this.created = Date.now();
      FORMATTED_DATE = moment(this.DATE_CREATED).format('DD/MM/YYYY, hA:mm');
      this.FORMATTED_DATE = FORMATTED_DATE;
    }
    this.updated.push(Date.now());
    FORMATTED_DATE = moment(this.DATE_CREATED).format('DD/MM/YYYY, hA:mm');
    this.FORMATTED_DATE = FORMATTED_DATE;
    next();
  });

  // announceSchema.pre('save', function(next, req, cb) {
  //   console.log('********* handle Category *********');
  //   if (!req.body.category) {
  //     return next();
  //   }
  //   var Category = mongoose.model('Category');
  //   var self = this;
  //   Category.findOne({
  //       _id: req.body.category
  //   }, function(err, doc) {
  //     if (err) {
  //       next(err);
  //     }
  //     if (doc) {
  //       self.category = doc;
  //     }
  //     next();
  //   });
  // });

  // announceSchema.pre('save', function(next, req, cb) {
  //   if (this.isNew) {
  //     return next(cb);
  //   }
  //   var Transaction = mongoose.model('Transaction');
  //   var self = this;
  //   var tasks = [];
  //   console.log('******** handle Price Change with existant transaction');
  //   if (!req.body.price || self.price == req.body.price) {
  //     return next(cb);
  //   }
  //   self.price = req.body.price;
  //   console.log('price different ! reset transaction');
  //   Transaction.find({announce:self._id}, function(err, transacs) {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (!transacs) {
  //       return next(cb);
  //     }
  //     transacs.forEach(function(item, index) {
  //       console.log('- foreach');
  //       item.client.status = 0;
  //       item.owner.status = 0;
  //       item.status = 0;
  //       item.statusInformation = 'En attente, modifié par l\'auteur';
  //       tasks.push(item.save());
  //     });
  //     console.log('Q.all');
  //     Q.all(tasks)
  //     .then(function(results) {
  //       console.log('results : ');
  //       console.log(results);
  //       next(callback);
  //     }, function(err) {
  //       next(err);
  //     });
  //   });
  // });
  
  /////////////////////////////////////////////////////////////////
  // STATICS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.statics = {

    addAnnouncePost: function(announce) {
      var username = announce.creator ?
      announce.creator.username :
      announce.creatorUsername.username;
      var creatorId = announce.creator ?
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
      return announcePost;
    },

    load: function(id, cb) {
      console.log('*****************load announce******************');
      console.log(id);
      this.findOne({
          _id: id
      }).populate('creator creatorUsername').exec(cb);
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
    console.log('slug generator');
    options = options || {};
    var key = options.key || 'title';

    return function slugGenerator(schema) {
      schema.path(key).set(function(v) {
        this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
        return v;
      });
    };
  }

  announceSchema.plugin(slugGenerator());

  /////////////////////////////////////////////////////////////////
  // create the model for announce and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Announce', announceSchema);
};
