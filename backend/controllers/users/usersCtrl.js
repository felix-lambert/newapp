/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var fs           = require('fs-extra');
var path         = require('path');
var crypto       = require('crypto');
var User         = mongoose.model('User');
var Notification = mongoose.model('Notification');
var Status       = mongoose.model('Status');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // UPLOAD IMAGE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  upload: function(req, res) {
    console.log('//////File caracteristics/////////');
    var destPath = path.join(__dirname, '../../../frontend/images/');
    var originalFilename = req.files.file.originalFilename;
    if (originalFilename) {
      console.log('originalFilename' + originalFilename);
      var hashName = crypto.createHash('md5').
      update(originalFilename).digest('hex') + '.jpeg';
      var writeStream = req.files.file.ws;
      while (fs.existsSync(destPath + hashName)) {
        hashName = hashName.substring(0, hashName.length - 5);
        var rnd = crypto.randomBytes(3);
        var value = new Array(3);
        var len = hashName.length;
        for (var i = 0; i < 3; i++) {
          value[i] = hashName[rnd[i] % len];
        }
        hashName = hashName + value.join('') + '.jpeg';
      }
      fs.copy(writeStream.path, destPath + hashName, function(err) {
        if (err) {
          return res.send(err);
        }
        fs.chmodSync(destPath + hashName, '755');
        fs.remove(writeStream.path, function(err) {
          if (err) {
            return res.error(err);
          }
        });
      });
      var user = req.user;
      user.images.push(hashName);
      user.save(function(err) {
        if (!err) {
          res.status(200).json({
            images: user.images
          });
        } else {
          console.log(err);
          console.log('Error: could not save image');
        }
      });
    } else {
      res.status(400).json('No images');
    }
  },

  getImages: function(req, res, next) {
    User.findById(req.user, function(err, user) {
      if (err) {
        return next(new Error('Failed to load Images'));
      }
      console.log(user);
      if (user) {
        console.log('see results');
        console.log(user);
        res.status(200).json(user.images);
      } else {
        res.status(404).json('USER_NOT_FOUND');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SHOW PROFILE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  show: function(req, res, next) {
    console.log('show user profile');
    var userId = req.params.id;
    User.findById(userId, function(err, user) {
      if (err) {
        return next(new Error('Failed to load User'));
      }
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json('USER_NOT_FOUND');
      }
    });
  },
};
