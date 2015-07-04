/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var Notification = mongoose.model('Notification');
var ee           = require('../../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET NOTIFICATION /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getNotifications: function(req, res, next) {
    console.log('___________get Notification________________________');
    if (req.user) {
      Notification.findUserNotifications({
        creator: req.user._id
      }, function(err, notifications) {
        if (err) {
          ee.emit('error', err);
          return res.status(501).json(err);
        } else {
          console.log(notifications);
          return res.status(200).json(notifications);
        }
      });
    } else {
      return res.status(400).json('User is not recognized');
    }
  },

  /////////////////////////////////////////////////////////////////
  // DELETE NOTIFICATION //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteNotification: function(req, res) {
    console.log('deleteNotification');
    Notification.find({_id: req.body.userToDelete}).remove()
    .exec(function(err) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      } else {
        return res.status(200).json('remove notif');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SAVE NOTIFICATION ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  saveNotification: function(req, res, next) {
    console.log('saveNotification');
    Notification.findOneAndUpdate({
      'creator': req.body.userDesId
    }, {
      userRec: req.user.username,
      userDes: req.body.userDes,
      userId: req.user._id,
      creator: req.body.userDesId,
      type: req.body.type
    }, {upsert: true})
    .exec(function(err) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(201).json('save succeeded');
      }
    });
  },
};
