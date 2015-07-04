/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Comment  = mongoose.model('AnnounceComment');
var Announce = mongoose.model('Announce');
var moment   = require('moment');
var ee       = require('../../config/event');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addComment: function(req, res) {
    console.log('_______ADD COMMENT_____');

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
          _id: req.params.announceId
      }, function(error, result) {
        if (error) {
          findOneAnnounceCallback(error);
        } else {
          findOneAnnounceCallback(null, result);
        }
      });
    }

    function saveComment(announce, saveCommentCallback) {
      var comment      = new Comment();
      comment.content  = req.body.content;
      comment.creator  = req.user._id;
      comment.announce = announce;
      comment.save(function(err, comments) {
        if (err) {
          saveCommentCallback(err);
        } else {
          saveCommentCallback(null);
        }
      });
    }
    // Faire une promise
    async.waterfall([findOneAnnounce, saveComment], function(error) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json(null);
      }
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

    function findAnnounce(findAnnounceCallback) {
      Comment.findOne({
          _id: req.params.id
      }, function(error, result) {
        if (error) {
          findAnnounceCallback(error);
        } else {
          findAnnounceCallback(null, result);
        }
      });
    }

    function removeComment(comment, removeCommentCallback) {
      if (checkRemove(comment)) {
        Comment.remove(comment, function(err) {
          if (err) {
            removeCommentCallback(err);
            //handle readFile error or processFile error here
          } else {
            removeCommentCallback(null);
          }
        });
      } else {
        removeCommentCallback('you can\'t remove this announce');
      }
    }

    // Faire une promise
    async.waterfall([findAnnounce, removeComment], function(error) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(null);
      } else {
        res.status(200).json(null);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET COMMENTS /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getComments: function(req, res) {
    console.log('_____GET /api/announceComment/' + req.params.announceId);

    function getComments(comments) {
      var retComments = [];
      comments.forEach(function(item) {
        if (item.FORMATTED_DATE) {
          var m               = moment(item.FORMATTED_DATE, 'DD/MM/YYYY, hA:mm');
          item.FORMATTED_DATE = m.fromNow();
        }
        retComments.push(item);
      });
      return retComments;
    }

    Comment.find({
      announce: req.params.announceId
    })
    .sort('-date')
    .exec(function(err, comments) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      res.status(200).json(getComments(comments));
    });
  }
};
