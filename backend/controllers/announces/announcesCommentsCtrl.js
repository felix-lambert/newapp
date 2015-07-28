/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Comment  = mongoose.model('AnnounceComment');
var Announce = mongoose.model('Announce');
var moment   = require('moment');
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
        findOneAnnounceCallback(error ? error : null, result);
      });
    }

    function saveComment(announce, saveCommentCallback) {
      var comment      = new Comment();
      comment.content  = req.body.content;
      comment.creator  = req.user._id;
      comment.announce = announce;
      comment.save(function(error, comments) {
        saveCommentCallback(error ? error : null);
      });
    }
    // Faire une promise
    async.waterfall([findOneAnnounce, saveComment], function(error) {
      console.log(error);
      res.status(error ? 400 : 200).json(error);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeComment: function(req, res) {
    console.log('______DELETE /api/announceComment___');

    function checkRemove(announce) {
      if (req.user._id.equals(announce.creator._id) ||
              req.user._id === announce.creator._id) {
        console.log('true');
        return true;
      } else {
        console.log('false');
        return false;
      }
    }

    function findAnnounce(findAnnounceCallback) {
      console.log('find announce');
      console.log(req.params.id);
      Comment.findOne({
        _id: req.params.id
      }, function(error, result) {
        console.log('test');
        findAnnounceCallback(error ? error : null, result);
      });
    }

    function removeComment(comment, removeCommentCallback) {
      console.log('remove comment');
      if (checkRemove(comment)) {
        console.log('inside comment');
        console.log(comment);
        console.log(comment._id);
        Comment.remove(comment._id, function(error) {
          console.log('___callback___');
          removeCommentCallback(error ? error : null);
        });
      } else {
        console.log('___no callback___');
        removeCommentCallback('you can\'t remove this announce');
      }
    }

    // Faire une promise
    async.waterfall([findAnnounce, removeComment], function(error) {
      res.status(error ? 400 : 200).json(error);
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
    .exec(function(error, comments) {
      res.status(error ? 400 : 200).json(error ? error : getComments(comments));
    });
  }
};
