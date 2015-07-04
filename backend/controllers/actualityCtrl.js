/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Actuality = mongoose.model('Actuality');
var User      = mongoose.model('User');
var ee        = require('../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET STATUS ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getActualities: function(req, res) {
    console.log('_____GET /api/actuality');
    Actuality.find()
    .sort('-date')
    .exec(function(err, actualities) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      res.status(200).json(actualities);
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addActuality: function(req, res) {
    console.log('_______ADD Actuality_____');
    var actuality         = new Actuality();
    actuality.content     = req.body.content;
    actuality.status      = req.body.status;
    actuality.creator     = req.user._id;
    actuality.save(function(err) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(200).json();
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE ACTUALITY /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeActuality: function(req, res) {
    console.log('______DELETE /api/actuality___');
    Actuality.findOne({
        _id: req.params.id
    }, function(err, result) {
        if (err) {
          res.status(501).json('Status not found.');
        } else {
          User.findOne({
              _id: result.status
          }, function(err, status) {
            if (req.user._id.equals(result.author)) {
              Actuality.remove(result, function(err) {
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
                'message': 'Impossible to find actuality'
              });
            } else if (req.user._id == actuality.creator) {
              Actuality.remove(result, function(err) {
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
