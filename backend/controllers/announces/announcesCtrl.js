/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose   = require('mongoose');
var Announce   = mongoose.model('Announce');
var validator  = require('validator');
var Comment    = mongoose.model('AnnounceComment');
var Q          = require('q');
var User       = mongoose.model('User');
var ImageModel = mongoose.model('Image');
var async      = require('async');
var moment   = require('moment');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postAnnounce: function(req, res) {
    console.log('_____________POST /api/announces_____');
    var announce = new Announce({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        price: req.body.price,
        creator : req.user._id,
        creatorUsername: req.user._id,
        activated: req.body.activated,
        category: req.body.category,
        tags: req.body.tags,
        nbComment: 0
    });
    announce.save(function(err, saveItem) {
      if (err) {
        return res.status(400).json(err);
      } else {

          return res.status(200).json();
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // UPDATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  updateAnnounce: function(req, res) {

    console.log('*****************Update announce*******************');
    Announce.findOne({
        '_id': req.params.announceId
    }, function(err, result) {
      if (err || !result) {
        return res.status(500).json(err);
      }

      if (result.creator.equals(req.user._id)) {
        result.title = req.body.title;
        result.content = req.body.content;
        if (req.body.activated === false || req.body.activated === true) {
          result.activated = req.body.activated;
        }
        result.save(function(err) {
          if (err) {
            console.log('THERE IS THE ERROR');
            res.status(400).json(err);
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        return res.status(500).send('You can only update your own announce.');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SHOW AN ANNOUNCE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  show: function(req, res) {
    console.log('***************load announce*********************');
    Announce.load(req.params.announceId, function(err, announce) {
      if (err) {
        return next(err);
      }
      if (!announce) {
        return next(new Error('Failed to load announce '));
      } else {
        var announcePost = Announce.addAnnouncePost(announce);
        console.log("/////////////////////");
        res.status(200).json(announcePost);
      }
    });

  },

  /////////////////////////////////////////////////////////////////
  // DELETE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteAnnounce: function(req, res) {
    console.log('_____________________destroy announce____________');
    Announce.remove({'_id': req.params.announceId}, function(err, announce) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json();
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET ANNOUNCE FROM USER ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getAnnouncesFromUser: function(req, res) {
    console.log('____________get announce from user__________');
    Announce.find({
      creator: req.user._id
    })
    .sort('-created')
    .populate('creator')
    .exec(function(err, announces) {
      if (err) {
        return res.status(501).json(err);
      }
      res.status(200).json(announces);
    });
  },

  /////////////////////////////////////////////////////////////////
  // ANNOUNCE PAGINATION //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  listPagination: function(req, res) {
    var findAnnounces = function(next) {
      Announce
          .find()
          .sort('-created')
          .populate('creator')
          .select()
          .skip((req.params.limit * req.params.page) - req.params.limit)
          .limit(req.params.limit)
          .exec(next);
    };
    var countAnnounces = function(next) {
      Announce.count().exec(next);
    };

    var countComments = function(next) {
      Comment.count({
        announce: item._id
      }).exec(next);
    };

    async.parallel({
        find: findAnnounces,
        count: countAnnounces,
        countComments: countComments
    }, function done(err, results) {
      var sendAnnounces = [];
      async.parallel({}, function done(err, results) {

      });
      results.find.forEach(function(item) {
        if (item.FORMATTED_DATE) {
          var m               = moment(item.FORMATTED_DATE, 'DD/MM/YYYY, hA:mm');
          item.FORMATTED_DATE = m.fromNow();
        }
        item.nbComment = count;
        console.log(item.nbComment);
        sendAnnounces.push(item);
      });
      return res.json({
        total: Math.ceil(results.count / req.params.limit),
        announces: sendAnnounces
      });
    });
  },

  listUserPagination: function(req, res) {
    var findAnnounces = function(next) {
      console.log('req.params.user');

      Announce
          .find({creator: req.params.user})
          .sort('-created')
          .select()
          .skip((req.params.limit * req.params.page) - req.params.limit)
          .limit(req.params.limit)
          .sort({date_added: -1})
          .exec(next);
    };
    var countAnnounces = function(next) {
      Announce.count({creator: req.params.user}).exec(next);
    };

    async.parallel({
        find: findAnnounces,
        count: countAnnounces
    }, function done(err, results) {
     
      return res.status(200).json({
        total: Math.ceil(results.count / req.params.limit),
        announces: results.find
      });
    });
  },

};