/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Announce  = mongoose.model('Announce');
var validator = require('validator');
var Comment   = mongoose.model('AnnounceComment');
var Q         = require('q');
var User      = mongoose.model('User');
var ImageModel = mongoose.model('Image');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET ANNOUNCE BY ID ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getAnnounce: function(req, res, next) {
    console.log('***************load announce*********************');
    Announce.load(req.params.announceId, function(err, announce) {
      if (err) {
        return next(err);
      }
      if (!announce) {
        return next(new Error('Failed to load announce '));
      }
      console.log(announce);
      // var announcePost = {
      //     _id: announce._id,
      //     created: announce.created,
      //     creator: {
      //         _id: announce.creator._id,
      //         username: announce.creator.username,
      //         profileImage: announce.creator.profileImage
      //     },
      //     title: announce.title,
      //     category: announce.category,
      //     type: announce.type,
      //     slug: announce.slug,
      //     __v: announce.__v,
      //     updated: announce.updated,
      //     content: announce.content,
      //     rating: announce.rating,
      //     status: announce.status,
      //     price: announce.price,
      //     images:announce.images
      // };
      req.announce = announcePost;
      next();
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postAnnounce: function(req, res) {
    console.log('_____________POST /api/announces_____');
    console.log(req.user);
    var announce = new Announce({
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        price: req.body.price,
        category: req.body.category,
        creator : req.user._id,
    });
    announce.save(req, function(err, saveItem) {
      if (err) {
        res.status(400).json(err);
      } else {
        announce.id = saveItem._id;
        res.status(200).json(announce);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // UPDATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  updateAnnounce: function(req, res) {

    console.log('*****************Update announce*******************');
    Announce.findOne({
        '_id': req.announce._id
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
        result.save(req, function(err) {
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
    res.status(200).json(req.announce);
  },

  /////////////////////////////////////////////////////////////////
  // DELETE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteAnnounce: function(req, res) {
    console.log('_____________________destroy announce____________');
    var announce = req.announce;
    Announce.remove(announce, function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(announce);
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
    var page = 1;
    var perPage = 20;
    var sort = 1;
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
            tasks.push(ImageModel.populate(announces[i].creator, {
              path:'profileImage', select:'name small xsmall'}));
          }
          Q.all(tasks)
          .then(function(results) {
            res.status(200).json(announces);
          }, function(err) {
            res.status(500).json({err:'oups'});
          });
        }
      });
  }
};
