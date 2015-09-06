var autopopulate = require('mongoose-autopopulate');
var chalk     = require('chalk');


exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;


  var actualitySchema = new Schema({
    content: String,
    status: Number,
    creator: {
      type: Schema.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    likeCreator: {
      type: Schema.ObjectId,
      ref: 'Like',
      autopopulate: true
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
    console.log(chalk.blue('***************presave Actuality*****************'));
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  actualitySchema.plugin(autopopulate);

  mongoose.model('Actuality', actualitySchema);
};
