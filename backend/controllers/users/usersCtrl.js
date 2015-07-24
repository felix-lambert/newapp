/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var ee       = require('../../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // SHOW PROFILE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  // show: function(req, res, next) {
  //   console.log('show user profile');
  //   var userId = req.params.id;
  //   User.findById(userId, function(err, user) {
  //     if (err) {
  //       ee.emit('error', err);
  //       return next(new Error('Failed to load User'));
  //     }
  //     if (user) {
  //       res.status(200).json(user);
  //     } else {
  //       res.status(404).json('USER_NOT_FOUND');
  //     }
  //   });
  // },
};
