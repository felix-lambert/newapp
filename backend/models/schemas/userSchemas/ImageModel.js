var Q = require('q');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var ImageSchema = new Schema({
      name: String,
      ext:String,
      size:Number,
      mimetype:String,
      path:String,
      small:String,
      xsmall:String,
      author: {
          type: Schema.ObjectId,
          ref: 'User'
      },
  });

  ImageSchema.pre('save', function(next, cb) {
    console.log('**** image pre save : define path ****');
    var self = this;
    var User = mongoose.model('User');
    if (!self.author) {
      return cb('No author found.', null);
    }
    User.findOne({_id:self.author}, function(err, user) {
      if (err || !user) {
        return cb(err, null);
      }
      self.path = '/uploads/' + user.username + '/' + self.name;
      self.small = '/uploads/' + user.username + '/200/' + self.name;
      self.xsmall = '/uploads/' + user.username + '/50/' + self.name;
      return next(cb);
    });
  });

  ImageSchema.methods._save = function(data) {
    var deferred = Q.defer();
    this.save(function(err, image) {
      if (err || !image) {
        deferred.reject(err);
      } else {
        deferred.resolve(image);
      }
    });
    return deferred.promise;
  };

  var ImageModel = mongoose.model('Image', ImageSchema);
};
