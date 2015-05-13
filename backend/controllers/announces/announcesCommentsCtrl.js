/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Comment  = mongoose.model('AnnounceComment');
var Announce = mongoose.model('Announce');
var moment   = require('moment');

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
      comment.save(function(err, comments) {
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

    function checkRemove(announce) {
      if (req.user._id.equals(announce.creator) ||
              req.user._id === announce.creator ||
              req.user._id === announce.creatorUsername) {
        return true;
      } else {
        return false;
      }
    }
    // Faire une promise
    Comment.findOne({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
          res.status(501).json('Comment not found.');
        } else {
          Announce.findOne({
              _id: result.announce
          }, function(err, announce) {
            if (checkRemove(announce)) {
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
    .populate('creator creatorUsername announce')
    .exec(function(err, comments) {
      if (err) {
        return res.status(501).json(err);
      }
      console.log(comments);
      var sendComments = [];
      comments.forEach(function(item) {
        if (item.FORMATTED_DATE) {
          var m               = moment(item.FORMATTED_DATE, 'DD/MM/YYYY, hA:mm');
          item.FORMATTED_DATE = m.fromNow();
          console.log(m.fromNow());
        }
        sendComments.push(item);
      });
      res.status(200).json(sendComments);
    });
  }
};
