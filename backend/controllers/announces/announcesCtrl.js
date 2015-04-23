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
    console.log(announce);
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
        if (req.body.title) {
          result.title = req.body.title;
        }
        if (req.body.content) {
          result.content = req.body.content;
        }
        if (req.body.activated === false || req.body.activated === true) {
          console.log(req.body.activated);
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
    console.log('show announce');

    console.log('***************load announce*********************');
    console.log(req.user);

    Announce.load(req.params.announceId, function(err, announce) {
      if (err) {
        return next(err);
      }
      if (!announce) {
        return next(new Error('Failed to load announce '));
      } else {
        var username = announce.creator ?
        announce.creator.username :
        announce.creatorUsername.username;
        var creatorId = announce.creator ?
        announce.creator :
        announce.creatorUsername;
        var profileImage = announce.creator ?
        announce.creator.profileImage :
        announce.creatorUsername.profileImage;
        var announcePost = {
          _id: announce._id,
          created: announce.created,
          creator: {
              _id: creatorId,
              username: username,
              profileImage: profileImage
          },
          title: announce.title,
          category: announce.category,
          type: announce.type,
          slug: announce.slug,
          __v: announce.__v,
          updated: announce.updated,
          content: announce.content,
          rating: announce.rating,
          status: announce.status,
          price: announce.price,
          activated: announce.activated
        };
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
    var page                   = 1;
    var perPage                = 20;
    var sort                   = 1;
    var messageErrorPagination = '';

    function checkSort() {
      if (typeof req.params.sort !== 'undefined' && req.params.sort) {
        if (validator.isNumeric(req.params.sort) === true &&
          req.params.sort < 2 && req.params.sort > -1) {
          if (req.params.sort === 0) {
            sort = -1;
          } else {
            req.params.sort = 1;
          }
        } else {
          messageErrorPagination += 'Erreur de l\'argument SORT (3). ';
          return false;
        }
      }
      return true;
    }

    function checkPerPage() {
      if (typeof req.params.perpage !== 'undefined' && req.params.perpage) {
        if (validator.isNumeric(req.params.perpage) === true &&
          req.params.perpage >= 0) {
          perPage = req.params.perpage;
        } else {
          messageErrorPagination += 'Erreur de l\'argument PERPAGE (2). ';
          return false;
        }
      }
      return true;
    }

    function checkPage() {
      if (typeof req.params.page !== 'undefined' && req.params.page) {
        if (validator.isNumeric(req.params.page) === true &&
          req.params.page > 0) {
          page = req.params.page;
        } else {
          messageErrorPagination += 'Erreur de l\'argument PAGE (1). ';
          return false;
        }
      }
      return true;
    }

    if (checkPage() === true && checkPerPage() === true &&
      checkSort() === true) {
      Announce.find({}, {}, {skip: ((page - 1) * perPage),
        limit: perPage, sort: {created: sort}})
      .populate('creator creatorComments', 'profileImage')
      .populate('category', 'title')
      .exec(function(err, annonces) {
        if (err) {
          return res.status(500).send({
            message: 'Erreur pendant la requete de liste des annonces'});
        }
        return res.status(200).send(annonces);
      });
    } else {
      return res.status(400).send({message: messageErrorPagination});
    }
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
