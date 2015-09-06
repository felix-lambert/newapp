/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Comment  = mongoose.model('AnnounceComment');
var Announce = mongoose.model('Announce');
var moment   = require('moment');
var async    = require('async');
var chalk     = require('chalk');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addComment: function(req, res) {
    console.log(chalk.blue('_______ADD COMMENT_____'));

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
          _id: req.params.announceId
      }, function(error, result) {
        findOneAnnounceCallback(error ? error : null, result);
      });
    }

    function saveComment(announce, saveCommentCallback) {
      var comment      = new Comment();
      comment.content  = req.body.announceComment;
      comment.creator  = req.user._id;
      comment.announce = announce;
      comment.save(function(error, comments) {
        saveCommentCallback(error ? error : null);
      });
    }
    // Faire une promise
    async.waterfall([findOneAnnounce, saveComment], function(error) {
      console.log(chalk.red(error));
      res.status(error ? 400 : 200).json(error);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeComment: function(req, res) {
    console.log(chalk.blue('______DELETE /api/announceComment___'));

    function checkRemove(announce) {
      if (announce.creator && req.user._id.equals(announce.creator._id) ||
              req.user._id === announce.creator._id) {
        return true;
      } else {
        return false;
      }
    }

    function findAnnounce(findAnnounceCallback) {
      Comment.findOne({
        _id: req.params.id
      }, function(error, result) {
        findAnnounceCallback(error ? error : null, result);
      });
    }

    function removeComment(comment, removeCommentCallback) {
      if (checkRemove(comment)) {
        Comment.remove({'_id': comment._id}, function(error, response) {
          removeCommentCallback(error ? error : null, comment);
        });
      } else {
        console.log(chalk.red('you can\'t remove this announce'));
        removeCommentCallback('you can\'t remove this announce');
      }
    }

    // Faire une promise
    async.waterfall([findAnnounce, removeComment], function(error, response) {
      res.status(error ? 400 : 200).json(error ? error : response);
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET COMMENTS /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getComments: function(req, res) {
    console.log(chalk.blue('______DELETE /api/announceComment___ '));

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
