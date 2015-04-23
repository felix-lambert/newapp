/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Comment  = mongoose.model('AnnounceComment');
var Announce = mongoose.model('Announce');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addComment: function(req, res) {
    console.log('_______ADD COMMENT_____');

    Announce.findOne({
      _id: req.params.announceId
    }, function(err, result) {
      if (err) {
        return res.status(501).json(err);
      }
      var comment             = new Comment();
      comment.content         = req.body.content;
      comment.creator         = req.user._id;
      comment.announce        = result;
      comment.save(function(err) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json({
              newRating: req.newRating
          });
        }
      });
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeComment: function(req, res) {
    console.log('______DELETE /api/announceComment___');

    Comment.findOne({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
          res.status(501).json('Comment not found.');
        } else {
          Announce.findOne({
              _id: result.announce
          }, function(err, announce) {
            console.log('////////////////////////////////////////////////////');
            console.log(announce);
            console.log(req.user);
            if (req.user._id.equals(result.creator)) {
              Comment.remove(result, function(err) {
                if (err) {
                  res.status(400).json(null);
                } else {
                  res.status(200).json(null);
                }
              });
            } else if (err) {
              res.status(400).json({
                'message': 'Impossible to find announce'
              });
              console.log('req.user ' + req.user);
              console.log(req.user._id);
            } else if (req.user._id === announce.creator || req.user._id === announce.creatorUsername) {
              console.log('************************************************');
              console.log(result);
              Comment.remove(result, function(err) {
                if (err) {
                  res.status(400).json(null);
                } else {
                  res.status(200).json(null);
                }
              });
            } else {
              res.status(400).json({
                  'message': 'error in remove comment'
              });
            }
          });
        }
      });
  },

  /////////////////////////////////////////////////////////////////
  // GET COMMENTS /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getComments: function(req, res) {
    console.log('_____GET /api/announceComment/' + req.params.announceId);
    Comment.find({
          announce: req.params.announceId
        })
        .sort('-date')
        .populate('creator creatorUsername')
        .exec(function(err, comments) {
          if (err) {
            res.status(501).json(err);
          }
          res.status(200).json(comments);
        });
  }
};
