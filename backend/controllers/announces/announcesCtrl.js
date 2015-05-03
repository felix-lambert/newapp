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
        activated: req.body.activated
    });
    announce.save(function(err, saveItem) {
      console.log(err);
      if (err) {
        return res.status(400).json(err);
      } else {
        // announce.id = saveItem._id;
        console.log('announce posted');
        return res.status(200).json(announce);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // UPDATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  updateAnnounce: function(req, res) {

    console.log('*****************Update announce*******************');
    console.log(req.params);
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
        console.log(result);
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
        res.status(200).json(announcePost);
      }
    });

  },

  /////////////////////////////////////////////////////////////////
  // DELETE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteAnnounce: function(req, res) {
    console.log('_____________________destroy announce____________');
    console.log(req.params.announceId);
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
            creator: req.params.userId
        })
        .sort('-created')
        .populate('creator creatorComments')
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
          .populate('creator')
          .select()
          .skip((req.params.limit * req.params.page) - req.params.limit)
          .limit(req.params.limit)
          .sort({date_added: -1})
          .exec(next);
    };
    var countAnnounces = function(next) {
      Announce.count().exec(next);
    };

    async.parallel({
        find: findAnnounces,
        count: countAnnounces
    }, function done(err, results) {
      return res.json({
          total: Math.ceil(results.count / req.params.limit),
          announces: results.find
      });
    });

  },

  listUserPagination: function(req, res) {
    console.log(req.params);
    var findAnnounces = function(next) {
      Announce
          .find({creator: req.params.user})
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
      console.log(results);
      return res.status(200).json({
        total: Math.ceil(results.count / req.params.limit),
        announces: results.find
      });
    });

  },


  /////////////////////////////////////////////////////////////////
  // GET ALL ANNOUNCES ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getAllAnnounces: function(req, res) {
    var tasks = [];
    console.log('************** Get All Announces **********');
    Announce.find()
      .sort('-created')
      .populate('creator creatorComments')
      .populate('category', 'title')
      .exec(function(err, announces) {
        if (err) {
          return res.status(501).json(err);
        } else {
          for (var i = 0; l = announces.length, i < l; i++) { 
            if (announces[i].activated === true) {
              tasks.push(announces[i]);
            }
          }
          Q.all(tasks)
          .then(function(results) {
            console.log('results');
            console.log(results);
            res.status(200).json(results);
          }, function(err) {
            res.status(500).json({err:'oups'});
          });
        }
      });
  }
};
