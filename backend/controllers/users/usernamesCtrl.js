/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Username = mongoose.model('Username');
var ee       = require('../../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET NOTIFICATION /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getUsername: function(req, res, next) {
    console.log('___________get Notification________________________');
    Username.findUsername({
      creator: req.user
    }, function(err, notifications) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      res.status(200).json(notifications);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE NOTIFICATION //////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteUsername: function(req, res) {
    console.log('deleteNotification');
    Notification.find({_id: req.body.userToDelete}).remove()
    .exec(function(err) {
      if (err) {
        ee.emit('error', err);
        return res.status(501).json(err);
      }
      res.status(200).json('remove notif');
    });
  },

  /////////////////////////////////////////////////////////////////
  // SAVE NOTIFICATION ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  saveUsername: function(req, res, next) {
    console.log('saveNotification');
    Username.find({
        'username': req.body.username
    }).sort('-created')
    .exec(function(err, usernames) {
      var notification;
      usernames.forEach(function(item) {
        if (item.username === req.body.username) {
          console.log('Username already exist');
          return res.status(400).json('Username already exist');
        }
      });
      username = new Username({
        username: req.body.username
      });
      username.save(function(err, saveUsernames) {
        if (err) {
          ee.emit('error', err);
          res.status(400).json(err);
        } else {
          Username.createUsernameToken(req.body.username,
            function(err, usersToken) {
            if (err) {
              ee.emit('error', err);
              res.status(400).json({error: 'Issue generating token'});
            } else {
              Username.getUsernameToken(req.body.username, usersToken,
                function(err, user) {
                if (err) {
                  ee.emit('error', err);
                  res.status(400).json({error: 'Issue finding user.'});
                } else {
                  res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    token: user.token.token,
                    reputation: user.reputation,
                    profileImage: user.profileImage,
                    DATE_CREATED: user.FORMATTED_DATE
                  });
                }
              });
            }
          });
        }
      });
    });
  },

};
