exports = module.exports = function(mongoose) {

  var Schema = mongoose.Schema;
  var config = require('../../../db/database.js');

  var TokenSchema = new Schema({
    token: {
        type: String
    },
    DATE_CREATED: {
        type: Date,
        default: Date.now
    },
  });

  TokenSchema.statics.hasExpired = function(created) {
    var now  = new Date();
    var diff = (now.getTime() - created);
    return diff > config.ttl;
  };

  var TokenModel = mongoose.model('Token', TokenSchema);
};
