/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Like      = mongoose.model('Like');
var Actuality = mongoose.model('Actuality');
var ee        = require('../../config/event');
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
        if (err) {
          ee.emit('error', err);
          return res.status(501).json(err);
        } else {
          return res.status(200).json(likes);
        }
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
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      } else {
        return res.status(200).json('remove notif');
      }
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
        if (err) {
          saveCallback(err);
        } else {
          saveCallback(null);
        }
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
          if (err) {
            updateLikeOnTypeCallback(err);
          } else {
            updateLikeOnTypeCallback(null);
          }
        });
      } else if (req.body.likeType === 'announce') {
        Announce.findOneAndUpdate({
          '_id': req.body.id
        }, {
          likeCreator: result._id
        }, {upsert: true})
        .exec(function(err, results) {
          if (err) {
            updateLikeOnTypeCallback(err);
          } else {
            updateLikeOnTypeCallback(null);
          }
          res.status(201).json();
        });
      }

    }

    // Faire une promise
    async.waterfall([save, updateLikeOnType], function(error) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json();
      }
    });
  },
};
