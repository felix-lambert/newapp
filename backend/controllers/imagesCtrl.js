/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var fs        = require('fs-extra');
var path      = require('path');
var crypto    = require('crypto');
var User      = mongoose.model('User');
var Images    = mongoose.model('Image');
var Status    = mongoose.model('Status');
var ee        = require('../config/event');
var Actuality = mongoose.model('Actuality');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // UPLOAD IMAGE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  upload: function(req, res) {
    console.log('//////File caracteristics/////////');
    var destPath         = path.join(__dirname, '../../frontend/images/');
    var originalFilename = req.files.file.originalFilename;
    if (originalFilename) {
      console.log('originalFilename' + originalFilename);
      var hashName    = crypto.createHash('md5').
      update(originalFilename).digest('hex') + '.jpeg';
      var writeStream = req.files.file.ws;
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
          ee.emit('error', err);
          return res.send(err);
        }
        fs.chmodSync(destPath + hashName, '755');
        fs.remove(writeStream.path, function(err) {
          if (err) {
            ee.emit('error', err);
            return res.error(err);
          }
        });
      });
      Images.find({
        creator: req.user._id
      })
      .sort('-created')
      .populate('creator')
      .exec(function(err, result) {
        if (err) {
          ee.emit('error', err);
          return res.status(501).json(err);
        }
        var profile = true ? result.length === 0 : false;
        var image = new Images({
          name: hashName,
          profileImage: profile,
          creator : req.user._id,
          creatorUsername: req.user._id
        });
        if (profile === true) {
          User.findOne({_id: req.user._id}).exec(function(err, resultForSave) {
            resultForSave.profileImage = hashName;
            resultForSave.save();
            var actuality     = new Actuality();
            actuality.content = hashName;
            actuality.status  = 2;
            actuality.creator = req.user._id;
            actuality.save();
          });
        }
        image.save(function(err, result) {
          if (err) {
            ee.emit('error', err);
            return res.status(400).json(err);
          } else {
            return res.status(200).json({
              images: result.name
            });
          }
        });
      });
    } else {
      res.status(400).json('No images');
    }
  },

  getImages: function(req, res, next) {

    console.log('____________get images from user__________');
    var sendImages = [];
    Images.find({
      creator: req.params.userId ? req.params.userId : req.user._id
    })
    .sort({profileImage: -1})
    .populate('creator')
    .exec(function(err, result) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      console.log(result);
      res.status(200).json(result);
    });
  },

  deleteImage: function(req, res, next) {

    console.log('____________get images from user__________');
    Images.remove({'_id': req.params.imageId}, function(err, image) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(200).json();
      }
    });
  },

  changeImageStatus: function(req, res, next) {
    console.log('updateImages');
    Images.findOne({'creator': req.user._id})
    .where('profileImage').equals(true)
    .exec(function(err, result) {
      console.log(result);
      result.profileImage = false;
      result.save(function(err, answer) {
        if (err) {
          console.log('THERE IS THE ERROR');
          ee.emit('error', err);
          res.status(400).json(err);
        } else {
          console.log('test if profile is false');
          console.log(answer);
          Images.findOne({
            '_id': req.params.imageId
          }, function(err, doProfile) {
            if (err || !doProfile) {
              ee.emit('error', err);
              return res.status(500).json(err);
            }
            User.findOne({'_id': req.user._id}).exec(function(err, res) {
              res.profileImage = req.params.imageName;
              res.save();
            });
            doProfile.profileImage = true;
            doProfile.save(function(err, response) {
              if (err) {
                ee.emit('error', err);
                res.status(400).json(err);
              } else {
                res.status(200).json(response);
              }
            });
          });
        }
      });
    });
  }
};
