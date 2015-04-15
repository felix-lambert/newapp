/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Status   = mongoose.model('Status');
var User     = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addStatus: function(req, res) {
    console.log('_______ADD STATUS_____');

    User.findOne({
      _id: req.params.statusId
    }, function(err, result) {
      if (err) {
        return res.status(501).json(err);
      }
      var status = new Status();
      status.content = req.body.content;
      status.author = req.user._id;
      status.user   = result;
      status.save(function(err) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json();
        }
      });
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
                    res.status(400).json(null);
                  } else {
                    res.status(200).json(null);
                  }
                });
              } else if (err) {
                res.status(400).json({
                  'message': 'Impossible to find status'
                });
              } else if (req.user._id == status.creator) {
                Status.remove(result, function(err) {
                  if (err) {
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
