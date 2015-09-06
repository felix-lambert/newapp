var chalk     = require('chalk');
var autopopulate = require('mongoose-autopopulate');
var fs        = require('fs-extra');

var crypto    = require('crypto');

exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var imageSchema = new Schema({
      name: String,
      profileImage: Boolean,
      date: {
          type: Date,
          default: Date.now
      },
      updated: [Date],
      creator: {
        type: Schema.ObjectId,
        ref:'User',
        autopopulate: true
      }
  });

  imageSchema.statics = {

    hashImage: function(imageName, ws, destPath, callback) {
      var hashName    = crypto.createHash('md5').update(imageName).digest('hex') + '.jpeg';
      var writeStream = ws;
      while (fs.existsSync(destPath + hashName)) {
        hashName  = hashName.substring(0, hashName.length - 5);
        var rnd   = crypto.randomBytes(3);
        var value = new Array(3);
        var len   = hashName.length;
        for (var i = 0; i < 3; i++) {
          value[i] = hashName[rnd[i] % len];
        }
        hashName = hashName + value.join('') + '.jpeg';
      }
      fs.copy(writeStream.path, destPath + hashName, function(err) {
        if (err) {
          return callback(err);
        }
        fs.chmodSync(destPath + hashName, '755');
        fs.remove(writeStream.path, function(err) {
          if (err) {
            return callback(err);
          }
        });
      });
      callback(null, hashName);
    }

  };

  /////////////////////////////////////////////////////////////////
  // PRE SAVE /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  imageSchema.pre('save', function(next, req, callback) {
     console.log(chalk.blue('***************presave image*****************'));
    if (this.isNew) {
      this.created = Date.now();
    }
    this.updated.push(Date.now());
    next();
  });

  imageSchema.plugin(autopopulate);

  mongoose.model('Image', imageSchema);
};
