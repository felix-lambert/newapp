var Q = require('q');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var announceSchema = new Schema({
    title: {
        type: String,
        index: true,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
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
    /*
    1 : disponible (pas de transaction, transaction en attente)
    2 : En cours (Transaction accepté : en cours)
    3 : Terminé (Transaction effectué)
    */
    created: Date,
    updated: [Date],
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    price: {
        type: Number,
        min : 1,
    },
    images: [{
        type: Schema.ObjectId,
        ref: 'Image'
    }],
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  announceSchema.pre('save', function(next, req, cb) {
    console.log('********* handle Category *********');
    if (!req.body.category) {
      return next();
    }
    var Category = mongoose.model('Category');
    var self = this;
    Category.findOne({
        _id: req.body.category
    }, function(err, doc) {
      if (err) {
        next(err);
      }
      if (doc) {
        self.category = doc;
      }
      next();
    });
  });

  announceSchema.pre('save', function(next, req, cb) {
    console.log('********* pre save images *********');
    if (!req.body.images) {
      return next();
    }
    var self = this;
    self.images = [];
    var images = req.body.images;
    images.forEach(function(item, index) {
      console.log('image : ');console.log(item._id);
      self.images.push(item._id);
    });
    next();
  });

  announceSchema.pre('save', function(next, req, cb) {
    if (this.isNew) {
      return next(cb);
    }
    var Transaction = mongoose.model('Transaction');
    var self = this;
    var tasks = [];
    console.log('******** handle Price Change with existant transaction');
    if (!req.body.price || self.price == req.body.price) {
      return next(cb);
    }
    self.price = req.body.price;
    console.log('price different ! reset transaction');
    Transaction.find({announce:self._id}, function(err, transacs) {
      if (err) {
        return next(err);
      }
      if (!transacs) {
        return next(cb);
      }
      transacs.forEach(function(item, index) {
        console.log('- foreach');
        item.client.status = 0;
        item.owner.status = 0;
        item.status = 0;
        item.statusInformation = 'En attente, modifié par l\'auteur';
        tasks.push(item.save());
      });
      console.log('Q.all');
      Q.all(tasks)
      .then(function(results) {
        console.log('results : ');
        console.log(results);
        next(callback);
      }, function(err) {
        next(err);
      });
    });
  });

  /////////////////////////////////////////////////////////////////
  // STATICS //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.statics = {
      load: function(id, cb) {
        console.log('*****************load announce******************');
        console.log(id);
        this.findOne({
            _id: id
        }).populate('creator creatorComment images').exec(cb);
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
