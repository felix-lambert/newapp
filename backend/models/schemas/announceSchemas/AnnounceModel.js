var Q            = require('q');
var moment       = require('moment');
var autopopulate = require('mongoose-autopopulate');
var chalk     = require('chalk');

var elasticsearch = require("elasticsearch");

if (process.env.NODE_ENV === 'production') {
  var ES = new elasticsearch.Client({
    host: "http://paas:f669a84c8a68e09959b4e8e88df26bf5@dwalin-us-east-1.searchly.com"
  });
} else {
  var ES = new elasticsearch.Client({
    host: "localhost:9200"
  });
}

ES.indices.create({
    index: "announce",
    body: {
      "settings": {
        "number_of_shards": 1, 
        "analysis": {
            "filter": {
                "autocomplete_filter": { 
                    "type":     "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 20
                }
            },
            "analyzer": {
                "autocomplete": {
                    "type":      "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "autocomplete_filter" 
                    ]
                }
            }
        }
    }
    }
}, function(err,resp,respcode) {
  console.log(chalk.blue('create index...'));
    
    ES.indices.putMapping({
      index: 'announce', 
      type: 'ann',
      body:{ 'ann': {
            "properties": {
                "title": {
                    "type":     "string",
                    "analyzer": "autocomplete"
                }
            }
        }
      } }, function(err, resp, respcode) {
        console.log('put mapping...');
        console.log(err,resp,respcode);
    });
});


exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  announceSchema = new Schema({
    title: {
      type: String,
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
    price: {
      type: Number,
      min : 1,
    }
  });
  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceSchema.pre('save', function(next, req, callback) {
    console.log(chalk.blue('***************presave announce*****************'));
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


  announceSchema.plugin(slugGenerator());

  announceSchema.plugin(autopopulate);
  /////////////////////////////////////////////////////////////////
  // create the model for announce and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Announce', announceSchema);
};
