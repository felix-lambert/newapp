var autopopulate = require('mongoose-autopopulate');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var moment = require('moment');

  var announceCommentSchema = new Schema({
      content: String,
      rating: Boolean,
      creator: {
          type: Schema.ObjectId,
          ref: 'User',
          autopopulate: true
      },
      date: {
          type: Date,
          default: Date.now
      },
      updated: [Date],
      FORMATTED_DATE: String,
      announce: {
          type: Schema.ObjectId,
          ref: 'Announce',
          autopopulate: true
      }
  });

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  announceCommentSchema.pre('save', function(next, req, callback) {
    console.log('***************presave announce*****************');
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

  announceCommentSchema.plugin(autopopulate);

  mongoose.model('AnnounceComment', announceCommentSchema);
};
