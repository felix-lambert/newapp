/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var Notification = mongoose.model('Notification');
var chalk     = require('chalk');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET NOTIFICATION /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getNotifications: function(req, res, next) {
    console.log(chalk.blue('___________get Notification________________________'));
    if (req.user) {
      Notification.findUserNotifications({
        'creator': req.user._id
      }, function(err, notifications) {
        res.status(200).json(notifications);
      });
    } else {
      console.log(chalk.red('User is not recognized'));
      return res.status(400).json('User is not recognized');
    }
  },

  /////////////////////////////////////////////////////////////////
  // DELETE NOTIFICATION //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteNotification: function(req, res) {
    console.log(chalk.blue('deleteNotification'));

    Notification.find({_id: req.params.notificationToDelete}).remove()
    .exec(function(err) {
      return res.status(err ? 501 : 200).json(err ? err : 'remove notif');
    });
  },

  /////////////////////////////////////////////////////////////////
  // SAVE NOTIFICATION ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  saveNotification: function(req, res, next) {
     console.log(chalk.blue('saveNotification'));
    Notification.findOneAndUpdate({
      'creator': req.body.userDesId
    }, {
      userRec: req.user.username,
      userDes: req.body.userDes,
      userId: req.user._id,
      creator: req.body.userDesId,
      type: req.body.type
    }, {upsert: true})
    .exec(function(err, result) {
      res.status(200).json(result);
    });
  },
};
