/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var Like         = mongoose.model('Like');
var Actuality    = mongoose.model('Actuality');
var ee           = require('../../config/event');

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
      .populate('creator')
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

    var like = new Like({
      userRec: req.body.usernameDes,
      creator: req.body.userDesId,
      userSend: req.user.username,
      likeType: req.body.likeType
    });

    like.save(function(err, result) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        if (req.body.likeType === 'actuality') {
          Actuality.findOneAndUpdate({
            '_id': req.body.id
          }, {
            likeCreator: result._id
          }, {upsert: true})
          .exec(function(err, results) {
            res.status(201).json();
          });
        }
        if (req.body.likeType === 'announce') {
          Actuality.findOneAndUpdate({
            '_id': req.body.id
          }, {
            likeCreator: result._id
          }, {upsert: true})
          .exec(function(err, results) {
            res.status(201).json();
          });
        }
      }
    });
  },
};
