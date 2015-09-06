/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose      = require('mongoose');
var Announce      = mongoose.model('Announce');
var Comment       = mongoose.model('AnnounceComment');
var async         = require('async');
var moment        = require('moment');
var async         = require('async');
var elasticsearch = require("elasticsearch");
var chalk     = require('chalk');

if (process.env.NODE_ENV === 'production') {
  var ES = new elasticsearch.Client({
    host: "http://paas:f669a84c8a68e09959b4e8e88df26bf5@dwalin-us-east-1.searchly.com"
  });
} else {
  var ES = new elasticsearch.Client({
    host: "localhost:9200"
  });
}

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postAnnounce: function(req, res) {

    console.log(chalk.blue('_____________POST /api/announces_____'));

    function saveAnnounceMongo(saveAnnounceMongoCallback) {
      if (req.body.title && req.body.content) {
        var announce = new Announce({
          title: req.body.title,
          content: req.body.content,
          type: req.body.type,
          price: req.body.price,
          creator : req.user._id,
          activated: req.body.activated,
          category: req.body.category,
          tags: req.body.tags,
          nbComment: 0,
        });
        announce.save(function(err, saveItem) {
          saveAnnounceMongoCallback(err ? err : null, announce, saveItem);
        });
      } else {
        saveAnnounceMongoCallback('You need to have a title or a content in the announces');
      }
    }

    function saveAnnounceES(announce, saveItem, saveAnnounceESCallback) {
      var FORMATTED_DATE;
      if (announce.isNew) {
        announce.created        = Date.now();
      }
      announce.updated.push(Date.now());
      ES.create({
        index: 'announce',
        type: 'ann',
        id: saveItem._id.toHexString(),
        body: {
          created: Date.now(),
          title: req.body.title,
          content: req.body.content,
          type: req.body.type,
          price: req.body.price,
          creator : req.user._id,
          activated: req.body.activated,
          category: req.body.category,
          tags: req.body.tags,
          nbComment: 0,
          FORMATTED_DATE: moment(announce.DATE_CREATED).format('DD/MM/YYYY, hA:mm')
        }
      }, function(err, res) {
        saveAnnounceESCallback(err ? err : null, announce);
      });
    }

    // Faire une promise
    async.waterfall([saveAnnounceMongo, saveAnnounceES], function(error, announce) {
      res.status(error ? 400 : 200).json(error ? error : announce);
    });
  },

  /////////////////////////////////////////////////////////////////
  // UPDATE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  updateAnnounce: function(req, res) {

    console.log(chalk.blue('*****************Update announce*******************'));

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
        '_id': req.params.announceId
      }, function(err, result) {

        if (err || !result) {
          findOneAnnounceCallback(err ? err : 'There is no announce to update');
        } else {
          findOneAnnounceCallback(null, result);
        }
      });
    }

    function updateAnnounce(result, updateAnnounceCallback) {
      if (result.creator._id.equals(req.user._id)) {
        result.title   = req.body.title;
        result.content = req.body.content;
        result.price = req.body.price;
        result.save(function(err) {
          updateAnnounceCallback(err ? err : null, result);
        });
      } else {
        console.log(chalk.red('You can only update your own announce.'));
      }
    }

    // Faire une promise
    async.waterfall([findOneAnnounce, updateAnnounce], function(error, result) {
      res.status(error ? 400 : 200).json(error ? error : result);
    });
  },

  /////////////////////////////////////////////////////////////////
  // SHOW AN ANNOUNCE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  show: function(req, res) {
    console.log(chalk.blue('***************load announce*********************'));

    Announce.findOne({'_id': req.params.announceId},
      function(err, announce) {
      if (err || !announce) {
        console.log(chalk.red('There is no announce to load'));
        res.status(400).json(err ? err : 'There is no announce to load');
      } else {
        Announce.organizeAnnounceData(announce, function(result) {
          res.status(200).json(result);
        });
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // CHANGE STATUS OF ANNOUNCE ////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  changeStatusAnnounce: function(req, res) {
    console.log(chalk.blue('***************status announce*********************'));

    function findOneAnnounce(findOneAnnounceCallback) {
      Announce.findOne({
        '_id': req.params.announceId
      }, function(err, result) {
        if (err || !result) {
          console.log(chalk.red('There is no announce to change status'));
          findOneAnnounceCallback(err ? err : 'There is no announce to change status');
        } else {
          findOneAnnounceCallback(null, result);
        }
      });
    }

    function updateAnnounceStatus(announce, updateAnnounceStatusCallback) {

      if (announce.creator._id.equals(req.user._id)) {
        announce.activated = req.params.status;
        announce.save(function(err) {
          updateAnnounceStatusCallback(err ? err : null, announce);
        });
      } else {
        console.log(chalk.red('You can only update your own announce.'));
        updateAnnounceStatusCallback('You can only update your own announce.');
      }
    }

    // Faire une promise
    async.waterfall([findOneAnnounce, updateAnnounceStatus], function(error, result) {
      res.status(error ? 400 : 200).json(error ? error : result);
    });
  },

  /////////////////////////////////////////////////////////////////
  // SEARCH AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  searchAnnounces: function(req, res) {
    console.log('_____________________search announce____________');
    var terms = req.params.terms || req.body.searchField;
    ES.search({
      index: 'announce',
      body: {
        'size' : 1000,
        'query': {
          'match': {
            'title': terms
          }
        }
      }
    }).then(function (resp) {

      var announces = resp.hits.hits;

      var initAnnounces = function(announce, doneCallback) {
        
        announce.title   = announce._source.title.length > 34 ?
        announce._source.title.substring(0, 35) + '...' :
        announce._source.title;
        announce.content = announce._source.content.length > 34 ?
        announce._source.content.substring(0, 35) + '...' :
        announce._source.content;
        announce.price   = announce._source.price;
        if (announce._source.FORMATTED_DATE) {
          var m                   = moment(announce._source.FORMATTED_DATE, 'DD/MM/YYYY, hA:mm');
          announce.FORMATTED_DATE = m.fromNow();
        }

        var ObjectID     = require('mongodb').ObjectID;
        
        announce.creator = result.creator;
        var _id = new ObjectID(announce._id);
        Comment.count({announce: _id}).exec(function(err, result) {
          announce.nbComment = result;
          doneCallback(err ? err : null, announce);
        });
      };

      async.map(announces, initAnnounces, function(err, result) {
        return res.status(err ? 400 : 200).json(err ? err : {
          total: resp.hits.total,
          announce: result
        });
      });
    }, function (err) {
      console.log(chalk.red(err));
      res.status(400).json(err.message);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE AN ANNOUNCE ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteAnnounce: function(req, res) {
    console.log(chalk.blue('_____________________destroy announce____________'));

    function deleteAnnounceMongo(deleteAnnounceMongoCallback) {
      console.log('delete announce mongo');
      Announce.findByIdAndRemove(req.params.announceId, function(err, announce) {
        deleteAnnounceMongoCallback(err ? err : null, announce);
      });
    }

    function deleteAnnounceES(announce, deleteAnnounceESCallback) {
      ES.delete({
        index: 'announce',
        type: 'ann',
        id : req.params.announceId
      }, function(err) {
        deleteAnnounceESCallback(err ? err : null, announce);
      });
    }
    // Faire une promise
    async.waterfall([deleteAnnounceMongo, deleteAnnounceES], function(error, announce) {
      if (error) {
        console.log(chalk.red(error));
        return res.status(400).json(error);  
      } else {
        return res.status(200).json(announce);
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
        .skip((10 * req.params.page) - 10)
        .limit(10)
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
          doneCallback(err ? err : null, item);
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
    console.log(chalk.blue('list user pagination'));
    
    var findAnnounces = function(next) {
      

      Announce
        .find({creator: req.user._id})
        .sort('-created')
        .select()
        .skip((10 * req.params.page) - 10)
        .limit(10)
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
      return res.status(err ? 400 : 200).json(err ? err : {
        total: results.count,
        announces: results.find
      });
    });
  }
};
