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
      var comment = new Comment();
      comment.content = req.body.content;
      comment.author = req.user._id;
      comment.announce = result;
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
              if (req.user._id.equals(result.author)) {
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
              } else if (req.user._id == announce.creator) {
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
        .populate('author', 'username facebook.username ' +
          'google.username linkedIn.username')
        .exec(function(err, comments) {
          if (err) {
            res.status(501).json(err);
          }
          res.status(200).json(comments);
        });
  }
};
