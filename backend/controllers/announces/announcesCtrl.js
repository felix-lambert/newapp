/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Announce = mongoose.model('Announce');
var Comment  = mongoose.model('AnnounceComment');
var async    = require('async');
var moment   = require('moment');
var ee       = require('../../config/event');
var async    = require('async');

Announce.createMapping(function(err, mapping) {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
    console.log(mapping);
  }
});

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postAnnounce: function(req, res) {
    console.log('_____________POST /api/announces_____');

    function saveAnnounceMongo(saveAnnounceMongoCallback) {
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
        nbComment: 0,
      });
      announce.save(function(err, saveItem) {
        if (err) {
          saveAnnounceMongoCallback(err);
        } else {
          saveAnnounceMongoCallback(null, announce);
        }
      });
    }

    function saveAnnounceES(announce, saveAnnounceESCallback) {
      announce.on('es-indexed', function(err, res) {
        if (err) {
          saveAnnounceESCallback(err);
        } else {
          saveAnnounceESCallback(null, announce);
        }
      });
    }

    // Faire une promise
    async.waterfall([saveAnnounceMongo, saveAnnounceES], function(error, announce) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json(announce);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // UPDATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  updateAnnounce: function(req, res) {

    console.log('*****************Update announce*******************');
    console.log(req.params);

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
        '_id': req.params.announceId
      }, function(err, result) {
        if (err || !result) {
          findOneAnnounceCallback(err);
        } else {
          findOneAnnounceCallback(null, result);
        }
      });
    }

    function updateAnnounce(announce, updateAnnounceCallback) {
      if (annnounce.creator.equals(req.user._id)) {
        announce.title   = req.params.title;
        announce.content = req.params.content;

        announce.save(function(err) {
          if (err) {
            console.log('THERE IS THE ERROR');
            ee.emit('error', err);
            updateAnnounceCallback(err);
          } else {
            updateAnnounceCallback(err, announce);
          }
        });
      } else {
        updateAnnounceCallback('You can only update your own announce.');
      }
    }

    // Faire une promise
    async.waterfall([findOneAnnounce, updateAnnounce], function(error, result) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json(result);
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
        ee.emit('error', err);
        return next(err);
      }
      if (!announce) {
        return next(new Error('Failed to load announce '));
      } else {
        Announce.organizeAnnounceData(announce, function(result) {
          res.status(200).json(result);
        });
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // CHANGE STATUS OF ANNOUNCE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  changeStatusAnnounce: function(req, res) {
    console.log('***************status announce*********************');

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
        '_id': req.params.announceId
      }, function(err, result) {
        if (err || !result) {
          findOneAnnounceCallback(err);
        } else {
          findOneAnnounceCallback(null, result);
        }
      });
    }

    function updateAnnounceStatus(announce, updateAnnounceStatusCallback) {
      console.log('update announce status');

      if (announce.creator._id.equals(req.user._id)) {
        announce.activated = req.params.status;
        announce.save(function(err) {
          if (err) {
            console.log('THERE IS THE ERROR');
            ee.emit('error', err);
            updateAnnounceStatusCallback(err);
          } else {
            updateAnnounceStatusCallback(err, announce);
          }
        });
      } else {
        updateAnnounceStatusCallback('You can only update your own announce.');
      }
    }

    // Faire une promise
    async.waterfall([findOneAnnounce, updateAnnounceStatus], function(error, result) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json(result);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SEARCH AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  searchAnnounces: function(req, res) {
    console.log('_____________________search announce____________');
    var terms = req.params.terms;
    console.log(req.params.terms);
    console.log(terms);
    Announce.search({
      query:{
        'multi_match': {
          'fields':  ['content', 'title'],
            'query': req.params.terms,
            'fuzziness': 'AUTO'
      }
    }}, function(err, results) {
      console.log('results');
      console.log(results.hits);
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(200).json({terms:terms, announces:results});
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
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(200).json();
      }
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
        .where('activated').equals(true)
        .skip((req.params.limit * req.params.page) - req.params.limit)
        .limit(req.params.limit)
        .exec(next);
    };
    var countAnnounces = function(next) {
      Announce.count().exec(next);
    };
    async.parallel({
      find: findAnnounces,
      count: countAnnounces
    }, function done(err, results) {

      var countComments = function(item, doneCallback) {
        if (item.FORMATTED_DATE) {
          var m               = moment(item.FORMATTED_DATE, 'DD/MM/YYYY, hA:mm');
          item.FORMATTED_DATE = m.fromNow();
        }
        Comment.count({announce: item._id}).exec(function(err, result) {
          item.nbComment = result;
          doneCallback(null, item);
        });
      };
      async.map(results.find, countComments, function(err, result) {
        return res.json({
          total: results.count,
          announces: result
        });
      });
    });
  },

  listUserPagination: function(req, res) {
    var findAnnounces = function(next) {
      console.log('list user pagination');

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
        total: results.count,
        announces: results.find
      });
    });
  }
};
