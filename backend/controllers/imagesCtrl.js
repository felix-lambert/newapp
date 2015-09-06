/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var path      = require('path');
var User      = mongoose.model('User');
var Images    = mongoose.model('Image');
var Actuality = mongoose.model('Actuality');
var async    = require('async');
var elasticsearch = require('elasticsearch');
var chalk     = require('chalk');

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
    console.log(chalk.blue('//////File caracteristics/////////'));
    var destPath;
    destPath = process.env.NODE_ENV === 'production' ?
    path.join(__dirname, '../../dist/images/') :
    destPath             = path.join(__dirname, '../../frontend/images/');
    var originalFilename = req.files.file.originalFilename;
    if (originalFilename) {
      function hash(callback) {
        console.log(req.files.file);
        Images.hashImage(originalFilename, req.files.file, destPath, function(err, hashedImageName) {
          if (err) {
            return callback(err);
          }
          callback(null, hashedImageName);  
        });
      }

      function testForSave(hashedImageName, callback) {
        console.log('testForSave');
        Images.find({
          creator: req.user._id
        })
        .sort('-created')
        .exec(function(err, result) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          var profile = true ? result.length === 0 : false;
          if (profile === true) {

            function saveProfileImageMongo(callback) {
              console.log('saveProfileImageMongo');
              User.findOne({_id: req.user._id}).exec(function(err, resultForSave) {
                if (err) {
                  return callback(err);
                }
                resultForSave.profileImage = hashedImageName;
                resultForSave.save(function(err) {
                  if (err) {
                    return callback(err);   
                  }
                  callback(null, resultForSave);
                });
              });
            }

            function saveProfileImageES(resultForSave, callback) {
              console.log('saveProfileImageES');
              ES.index({
                index: 'user',
                type: 'usr',
                id: resultForSave._id.toHexString(),
                body: {
                  username: resultForSave.username,
                  profileImage: resultForSave.profileImage
                }
              }, function (error, response) {
                if (error) {
                  return callback(error);
                }
                callback(null, resultForSave.profileImage);
                  
              });
            }

            function saveProfileImageActuality(profileImage) {
              console.log('saveProfileImageActuality');
              var actuality     = new Actuality();
              actuality.content = profileImage;
              actuality.status  = 2;
              actuality.creator = req.user._id;
              actuality.save(function(err) {
                if (err) {
                  return callback(err);
                }
              });
            }

            // Faire une promise
            async.waterfall([
              saveProfileImageMongo,
              saveProfileImageES,
              saveProfileImageActuality
            ], function(error, response) {
              if (error) {
                return res.status(400).json(error);
              }
            });
          }
          return callback(null, hashedImageName, profile);
        });
      }

      function saveImage(hashName, profile, callback) {
        console.log('saveImage');
        var image   = new Images({
          name: hashName,
          profileImage: profile,
          creator : req.user._id
        });
        image.save(function(err, result) {
          if (err) {
            return callback(err);
          }
          console.log(result);
          callback(null, {
            images: result.name
          });
        });
      }
      // Faire une promise
      async.waterfall([
        hash,
        testForSave,
        saveImage
      ], function(error, response) {
        console.log('test error');
        console.log(response);
        console.log('done.. ?');
        console.log(error);
        res.status(error ? 400 : 200).json(error ? error : response);
      });

    } else {
      console.log(chalk.red('No images'));
      res.status(400).json('No images');
    }
  },

  getImages: function(req, res, next) {
    console.log(chalk.blue('____________get images from user__________'));
    var sendImages = [];
    Images.find({
      creator: req.user._id
    })
    .sort({profileImage: -1})
    .exec(function(err, result) {
      return res.status(err ? 501 : 200).json(err ? err : result);
    });
  },

  deleteImage: function(req, res, next) {
    console.log(chalk.blue('____________delete image__________'));
    Images.findByIdAndRemove(req.params.imageId, function(err, image) {
      res.status(err ? 400 : 200).json(err ? err : image);
    });
  },

  changeImageStatus: function(req, res, next) {

    function findOneUserImage(findOneUserImageCallback) {
      Images.findOne({'creator': req.user._id})
      .where('profileImage').equals(true)
      .exec(function(err, result) {
        findOneUserImageCallback(err ? err : null, result);
      });
    }

    function saveImage(result, saveImageCallback) {
      if (result !== null) {
        console.log('save image...');
        console.log(result);
        result.profileImage = false;
        result.save(function(err) {
          Images.findOne({
            '_id': req.params.imageId
          }, function(err, doProfile) {
            saveImageCallback(err ? err : null, doProfile);
          });
        });
      } else {
        saveImageCallback(null);
      }
    }

    function saveOneProfileUserImageMongo(doProfile, callback) {

      User.findOne({'_id': req.user._id}).exec(function(err, result) {
        console.log(req.params.imageName);
        result.profileImage = req.params.imageName;
        result.save(function(err, response) {
          if (err) {
            callback(err);
          } else {
            doProfile.profileImage = true;
            doProfile.save(function(err, response) {
              if (err) {
                return callback(err); 
              }
              callback(null, response);
            });
          }
        });
      });

    }

    function saveOneProfileUserImageES(user, callback) {
      ES.index({
        index: 'user',
        type: 'usr',
        id: user._id.toHexString(),
        body: {
          username: user.username,
          profileImage: req.params.imageName
        }
      }, function (error, response) {
        console.log('put in elasticsearch');
        console.log(error);
        return callback(error ? error : null);
      });
    }

    // Faire une promise
    async.waterfall([
      findOneUserImage,
      saveImage,
      saveOneProfileUserImageMongo,
      saveOneProfileUserImageES
    ], function(error) {
      console.log('test error');
      console.log(error);
      res.status(error ? 400 : 200).json(error ? error : null);
    });
  }
};
