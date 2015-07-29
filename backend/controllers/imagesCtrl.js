/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var fs        = require('fs-extra');
var path      = require('path');
var crypto    = require('crypto');
var User      = mongoose.model('User');
var Images    = mongoose.model('Image');
var Actuality = mongoose.model('Actuality');
var async    = require('async');
var elasticsearch = require('elasticsearch');

if (process.env.NODE_ENV === 'production') {
  var ES = new elasticsearch.Client({
    host: "http://paas:f669a84c8a68e09959b4e8e88df26bf5@dwalin-us-east-1.searchly.com"
  });
} else {
  var ES = new elasticsearch.Client({
    host: "localhost:9200"
  });
}

module.exports = {

  /////////////////////////////////////////////////////////////////
  // UPLOAD IMAGE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  upload: function(req, res) {
    console.log('//////File caracteristics/////////');
    var destPath;
    destPath = process.env.NODE_ENV === 'production' ?
    path.join(__dirname, '../../dist/images/') :
    destPath             = path.join(__dirname, '../../frontend/images/');
    var originalFilename = req.files.file.originalFilename;
    if (originalFilename) {
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
          return res.send(err);
        }
        fs.chmodSync(destPath + hashName, '755');
        fs.remove(writeStream.path, function(err) {
          if (err) {
            return res.error(err);
          }
        });
      });
      Images.find({
        creator: req.user._id
      })
      .sort('-created')
      .exec(function(err, result) {
        if (err) {
          return res.status(501).json(err);
        }
        var profile = true ? result.length === 0 : false;
        var image   = new Images({
          name: hashName,
          profileImage: profile,
          creator : req.user._id
        });
        if (profile === true) {
          User.findOne({_id: req.user._id}).exec(function(err, resultForSave) {
            resultForSave.profileImage = hashName;
            resultForSave.save();
            ES.index({
              index: 'user',
              type: 'usr',
              id: resultForSave._id.toHexString(),
              body: {
                username: resultForSave.username,
                profileImage: hashName
              }
            }, function (error, response) {
                console.log('put in elasticsearch');
                console.log(error);
                console.log(response);
                var actuality     = new Actuality();
                actuality.content = hashName;
                actuality.status  = 2;
                actuality.creator = req.user._id;
                actuality.save();
              });
            });
        }
        image.save(function(err, result) {
          return res.status(err ? 400 : 200).json(err ? err : {
            images: result.name
          });
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
      creator: req.user._id
    })
    .sort({profileImage: -1})
    .exec(function(err, result) {
      console.log(result);
      return res.status(err ? 501 : 200).json(err ? err : result);
    });
  },

  deleteImage: function(req, res, next) {

    console.log('____________get images from user__________');
    Images.findByIdAndRemove(req.params.imageId, function(err, image) {
      res.status(err ? 400 : 200).json(err ? err : image);
    });
  },

  changeImageStatus: function(req, res, next) {

    function findOneUserImage(findOneUserImageCallback) {
      Images.findOne({'creator': req.user._id})
      .where('profileImage').equals(true)
      .exec(function(err, result) {
        console.log('find one user image');
        console.log(result);
        findOneUserImageCallback(err ? err : null, result);
      });
    }

    function saveImage(result, saveImageCallback) {
      if (result !== null) {
        console.log('save image...');
        console.log(result);
        result.profileImage = false;
        result.save(function(err) {
          console.log('save done...');
          console.log(err);
          console.log('find one image');
          console.log(req.params.imageId);
          Images.findOne({
            '_id': req.params.imageId
          }, function(err, doProfile) {
            saveImageCallback(err ? err : null, doProfile);
          });
        });
      } else {
        console.log('error ?????????????????????????');
        saveImageCallback(null);
      }
    }

    function saveOneProfileUserImage(doProfile, saveOneProfileUserImageCallback) {
      console.log('save one profileImage');
      console.log(doProfile);
      User.findOne({'_id': req.user._id}).exec(function(err, result) {
        console.log(req.params.imageName);
        result.profileImage = req.params.imageName;
        result.save(function(err, res) {
          if (err) {
            saveOneProfileUserImageCallback(err);
          } else {
            ES.index({
              index: 'user',
              type: 'usr',
              id: res._id.toHexString(),
              body: {
                username: res.username,
                profileImage: req.params.imageName
              }
            }, function (error, response) {
                console.log('put in elasticsearch');
                console.log(error);
                doProfile.profileImage = true;
                doProfile.save(function(err, response) {
                  saveOneProfileUserImageCallback(err ? err : null);
                });
              });
            }
          });
      });

    }
    // Faire une promise
    async.waterfall([
      findOneUserImage,
      saveImage,
      saveOneProfileUserImage
    ], function(error) {
      console.log('test error');
      console.log(error);
      res.status(error ? 400 : 200).json(error ? error : null);
    });
  }
};
