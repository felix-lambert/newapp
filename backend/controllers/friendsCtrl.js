/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Friend   = mongoose.model('Friend');
var User     = mongoose.model('User');
var ee       = require('../config/event');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE A FRIEND //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postFriend: function(req, res) {

    function saveReceiverFriendRequest(saveReceiverFriendRequestCallback) {
      Friend.saveFriend(req.body.idUser, req.user.username, function(error, result) {
        saveReceiverFriendRequestCallback(error ? error : null);
      });
    }

    function saveSenderFriendRequest(saveSenderFriendRequestCallback) {
      Friend.saveFriend(req.body.idUser, req.user.username, function(error, result) {
        saveSenderFriendRequestCallback(error ? error : null);
      });
    }

    function testIfReceiverFriendRequestDone(testIfReceiverFriendRequestDoneCallback) {
      Friend.testIfFriendRequestDone(req.body.idUser, function(result) {
        testIfReceiverFriendRequestDoneCallback(result === false ? 'friend request already done' : null);
      });
    }

    function testIfSenderFriendRequestDone(testIfSenderFriendRequestDoneCallback) {
      Friend.testIfFriendRequestDone(req.user._id, function(result) {
        testIfSenderFriendRequestDoneCallback(result === false ? 'friend request already done' : null);
      });
    }

    function saveWaitReceiverFriendRequest(saveWaitReceiverFriendRequestCallback) {
      var friend                       = new Friend();
      var waitFriendRequest            = req.body.usernameWaitFriendRequest;
      friend.usernameWaitFriendRequest = waitFriendRequest;
      friend.creator                   = req.user._id;
      friend.save(function(err) {
        saveWaitReceiverFriendRequestCallback(err ? err : null);
      });

    }

    function saveWaitSenderFriendRequest(saveWaitSenderFriendRequestCallback) {
      var friend                       = new Friend();
      var waitFriendRequest            = req.body.usernameWaitFriendRequest;
      friend.usernameWaitFriendRequest = req.user.username;
      friend.creator                   = req.user._id;
      friend.save(function(err) {
        saveWaitSenderFriendRequestCallback(err ? err : null);
      });

    }

    if (req.body.usernameAcceptedFriendRequest) {
      // Faire une promise
      async.waterfall([saveReceiverFriendRequest, saveSenderFriendRequest], function(error, result) {
        res.status(error ? 400 : 200).json(error ? error : null);
      });
    } else if (req.body.usernameWaitFriendRequest) {

      // Faire une promise
      async.waterfall([
        testIfReceiverFriendRequestDone,
        testIfSenderFriendRequestDone,
        saveWaitReceiverFriendRequest,
        saveWaitSenderFriendRequest
      ], function(error, result) {
        res.status(error ? 400 : 200).json(error ? error : null);
      });
    }
  },

  ///////////////////////////////////////////////////////////////
  // DELETE A FRIEND ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  deleteFriend: function(req, res) {
    console.log('_________destroy friend_____________');
    Friend.findOne({
      creator: req.params.friendId
    }).where('usernameWaitFriendRequest').equals(req.params.user)
    .remove(function(err, result) {
      res.status(err ? 400 : 200).json(err ? err : null);
    });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL FRIENDS FROM USER////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getFriendsFromUser: function(req, res) {
    console.log('************** Get All Friends **********');
    var sendFriends = [];
    Friend.find({creator: req.params.friendId})
    .sort('-created')
    .exec(function(err, friends) {
      if (err) {
        ee.emit('error', err);
        res.status(501).json(err);
      } else {
        friends.forEach(function(item) {
          if (item.usernameAcceptedFriendRequest) {
            sendFriends.push({
                accepted: item.usernameAcceptedFriendRequest
            });
          } else if (item.usernameWaitFriendRequest) {
            sendFriends.push({
                wait: item.usernameWaitFriendRequest
            });
          }
        });
        res.status(200).json(sendFriends);
      }
    });
  },

  testIfFriend: function(req, res) {
    console.log('************** Test if Friends **********');
    var testFriend = [];
    var testWait   = [];
    Friend.find({creator: req.user._id})
    .sort('-created')
    .exec(function(err, friends) {
      if (err) {
        ee.emit('error', err);
        res.status(501).json(err);
      } else {
        console.log(friends);
        friends.forEach(function(item) {
          if (item.usernameAcceptedFriendRequest) {
            testFriend.push(item.usernameAcceptedFriendRequest);
          }
        });
        if (testFriend.indexOf(req.params.user) === 0) {
          res.status(200).json(3);
        } else {
          friends.forEach(function(item) {
            if (item.usernameWaitFriendRequest) {
              testWait.push(item.usernameWaitFriendRequest);
            }
          });
          res.status(200).json(testWait.indexOf(req.params.user) === 0 ? 2 : 1);
        }
      }
    });
  },

    /////////////////////////////////////////////////////////////////
  // LIST ALL FRIENDS FROM USER////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  countFriends: function(req, res) {
    console.log('************** Count Friends **********');
    var sendFriends = [];
    console.log(req.params.idUser);
    Friend.find({creator: req.params.idUser})
      .sort('-created')
      .exec(function(err, friends) {
        if (err) {
          ee.emit('error', err);
          res.status(501).json(err);
        } else {
          console.log(friends);
          friends.forEach(function(item) {
            if (item.usernameAcceptedFriendRequest) {
              sendFriends.push({
                accepted: item.usernameAcceptedFriendRequest
              });
            }
          });
          res.status(200).json(sendFriends.length);
        }
      });
  },
};
