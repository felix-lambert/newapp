/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Like      = mongoose.model('Like');
var Actuality = mongoose.model('Actuality');
var async     = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET NOTIFICATION /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getLikes: function(req, res, next) {
    console.log('___________get Likes________________________');
    if (req.user) {
      Like.find({
        creator: req.user
      })
      .sort('-created')
      .exec(function(err, likes) {
        return res.status(err ? 501 : 200).json(err ? err : likes);
      });
    } else {
      return res.status(400).json('User is not recognized');
    }
  },

  /////////////////////////////////////////////////////////////////
  // DELETE LIKE //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteLike: function(req, res) {
    console.log('deleteLike');
    Like.remove({_id: req.body.userToDelete})
    .exec(function(err) {
      return res.status(err ? 501 : 200).json(err ? err : 'remove like');
    });
  },

  /////////////////////////////////////////////////////////////////
  // SAVE LIKE ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  saveLike: function(req, res, next) {
    console.log('______________save like______________________');

    function save(saveCallback) {
      var like = new Like({
        userRec: req.body.usernameDes,
        creator: req.body.userDesId,
        userSend: req.user.username,
        likeType: req.body.likeType
      });

      like.save(function(err, result) {
        saveCallback(err ? err : null);
      });
    }

    function updateLikeOnType(updateLikeOnTypeCallback) {
      if (req.body.likeType === 'actuality') {
        Actuality.findOneAndUpdate({
          '_id': req.body.id
        }, {
          likeCreator: result._id
        }, {upsert: true})
        .exec(function(err, results) {
          updateLikeOnTypeCallback(err ? err : null);
        });
      } else if (req.body.likeType === 'announce') {
        Announce.findOneAndUpdate({
          '_id': req.body.id
        }, {
          likeCreator: result._id
        }, {upsert: true})
        .exec(function(err, results) {
          updateLikeOnTypeCallback(err ? err : null);
        });
      }

    }

    // Faire une promise
    async.waterfall([save, updateLikeOnType], function(error) {
      res.status(error ? 400 : 200).json(error ? error : null);
    });
  },
};
