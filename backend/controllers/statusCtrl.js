/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Status   = mongoose.model('Status');
var User     = mongoose.model('User');
var ee       = require('../config/event');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET STATUS ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getStatus: function(req, res) {
    console.log('_____GET /api/status/' + req.params.statusId);
    Status.find({
      author: req.params.statusId
    })
    .sort('-date')
    .exec(function(err, status) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      res.status(200).json(status);
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addStatus: function(req, res) {
    console.log('_______ADD STATUS_____');

    function findOneStatus(findOneStatusCallback) {
      User.findOne({
        _id: req.params.statusId
      }, function(err, user) {
        if (err) {
          findOneStatusCallback(err);
        } else {
          findOneStatusCallback(null, user);
        }
      });
    }

    function saveStatus(user, saveStatusCallback) {
      var status     = new Status();
      status.content = req.body.content;
      status.author  = req.user._id;
      status.user    = user;
      status.save(function(err) {
        if (err) {
          saveStatusCallback(err);
        } else {
          saveStatusCallback(null);
        }
      });
    }

    // Faire une promise
    async.waterfall([findOneStatus, saveStatus], function(error) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json();
      }
    });

  },

  /////////////////////////////////////////////////////////////////
  // DELETE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeStatus: function(req, res) {
    console.log('______DELETE /api/statusComment___');
    Status.findOne({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
          res.status(501).json('Status not found.');
        } else {
          User.findOne({
              _id: result.status
          }, function(err, status) {
              if (req.user._id.equals(result.author)) {
                Status.remove(result, function(err) {
                  if (err) {
                    ee.emit('error', err);
                    res.status(400).json(null);
                  } else {
                    res.status(200).json(null);
                  }
                });
              } else if (err) {
                ee.emit('error', err);
                res.status(400).json({
                  'message': 'Impossible to find status'
                });
              } else if (req.user._id == status.creator) {
                Status.remove(result, function(err) {
                  if (err) {
                    ee.emit('error', err);
                    res.status(400).json(null);
                  } else {
                    res.status(200).json(null);
                  }
                });
              } else {
                res.status(400).json({
                    'message': 'error in remove status'
                });
              }
            });
        }
      });
  },
};
