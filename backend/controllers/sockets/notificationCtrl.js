/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var Notification = mongoose.model('Notification');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET NOTIFICATION /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getNotification: function(req, res, next) {
    console.log('___________get Notification________________________');
    Notification.findUserNotifications({
      creator: req.user
    }, function(err, notifications) {
      if (err) {
        return res.status(501).json(err);
      } else {
        res.status(200).json(notifications);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE NOTIFICATION //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteNotification: function(req, res) {
    console.log('deleteNotification');
    Notification.find({_id: req.body.userToDelete}).remove()
    .exec(function(err) {
      if (err) {
        return res.status(501).json(err);
      } else {
        res.status(200).json('remove notif');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SAVE NOTIFICATION ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  saveNotification: function(req, res, next) {
    console.log('saveNotification');
    Notification.find({
        'creator': req.body.userDesId
    }).sort('-created')
    .populate('creator', 'username')
    .exec(function(err, notifications) {
      var notification;
      for (var i = notifications.length - 1; i > -1; i--) {
        if (notifications[i].userRec === req.body.user) {
          console.log('Notification request already done');
          return res.status(400).json('Notification request already done');
        }
      }
      notification = new Notification({
          userRec: req.body.user,
          userDes: req.body.userDes,
          userId: req.body.userId
      });
      notification.creator = req.body.userDesId;
      notification.save(function(err, saveNotification) {
        if (err) {
          res.status(400).json(err);
        } else {
          console.log('NOTICATION SAVED');
          res.status(201).json('save succeeded');
        }
      });
    });
  },
};
