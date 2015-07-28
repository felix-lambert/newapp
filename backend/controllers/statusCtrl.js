/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Status   = mongoose.model('Status');
var User     = mongoose.model('User');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET STATUS ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getStatus: function(req, res) {
    console.log('_____GET /api/status/' + req.params.statusId);
    Status.find({
      author: req.user._id
    })
    .sort('-date')
    .exec(function(err, status) {
      return res.status(err ? 501 : 200).json(err ? err : status);
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
        res.status(400).json(error);
      } else {
        res.status(200).json();
      }
    });

  },

  /////////////////////////////////////////////////////////////////
  // DELETE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteStatus: function(req, res) {
    console.log('______DELETE /api/status___');
    function findOneStatus(findOneStatusCallback) {
      Status.findOne({
        _id: req.params.id
      }, function(err, result) {
        findOneStatusCallback(err ? err : null, result);
      });
    }

    function removeStatus(result, removeStatusCallback) {
      if (req.user._id == result.creator) {
        Status.remove(result, function(err) {
          removeStatusCallback(err ? err : null);
        });
      } else {
        removeStatusCallback('error in remove actuality');
      }
    }

    // Faire une promise
    async.waterfall([findOneStatus, removeStatus], function(error) {
      console.log(error ? error : null);
      res.status(error ? 400 : 200).json(error ? error : null);
    });
  },
};
