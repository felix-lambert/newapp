/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Friend   = mongoose.model('Friend');
var User     = mongoose.model('User');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE A FRIEND //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postFriend: function(req, res) {

    console.log(req.body);

    function saveReceiverFriendRequest(saveReceiverFriendRequestCallback) {
      console.log('saveReceiverFriendRequest');
      Friend.saveFriend(req.body.idUser, req.user.username, function(error, result) {
        console.log(error, result);
        saveReceiverFriendRequestCallback(error ? error : null);
      });
    }

    function saveSenderFriendRequest(saveSenderFriendRequestCallback) {
      console.log('saveSenderFriendRequest');
      Friend.saveFriend(req.user._id, req.body.usernameAcceptedFriendRequest, function(error, result) {
        console.log(error, result);
        saveSenderFriendRequestCallback(error ? error : null);
      });
    }

    function testIfReceiverFriendRequestDone(testIfReceiverFriendRequestDoneCallback) {
      console.log('testIfReceiverFriendRequestDone');
      Friend.testIfFriendRequestDone(req.body.idUser, function(result) {
        console.log(result);
        testIfReceiverFriendRequestDoneCallback(result === false ? 'friend request already done' : null);
      });
    }

    function testIfSenderFriendRequestDone(testIfSenderFriendRequestDoneCallback) {
      console.log('testIfSenderFriendRequestDone');
      Friend.testIfFriendRequestDone(req.user._id, function(result) {
        console.log(result);
        testIfSenderFriendRequestDoneCallback(result === false ? 'friend request already done' : null);
      });
    }

    function saveWaitReceiverFriendRequest(saveWaitReceiverFriendRequestCallback) {
      console.log('saveWaitReceiverFriendRequest');
      var friend                       = new Friend();
      var waitFriendRequest            = req.user.username;
      friend.usernameWaitFriendRequest = waitFriendRequest;
      friend.creator                   = req.body.idUser;
      friend.save(function(err, result) {
        console.log(err);
        console.log(result);
        saveWaitReceiverFriendRequestCallback(err ? err : null);
      });

    }

    function saveWaitSenderFriendRequest(saveWaitSenderFriendRequestCallback) {
      console.log('saveSenderFriendFriendRequest');
      var friend                       = new Friend();
      friend.usernameWaitFriendRequest = req.body.usernameWaitFriendRequest;
      friend.creator                   = req.user._id;
      friend.save(function(err) {
        console.log(err);
        saveWaitSenderFriendRequestCallback(err ? err : null);
      });

    }

    if (req.body.usernameAcceptedFriendRequest) {
      console.log('usernameAcceptedFriendRequest');
      // Faire une promise
      async.waterfall([saveReceiverFriendRequest, saveSenderFriendRequest], function(error, result) {
        console.log(error, result);
        res.status(error ? 400 : 200).json(error ? error : null);
      });
    } else if (req.body.usernameWaitFriendRequest) {
      console.log('usernameWaitFriendRequest');
      // Faire une promise
      async.waterfall([
        testIfReceiverFriendRequestDone,
        testIfSenderFriendRequestDone,
        saveWaitReceiverFriendRequest,
        saveWaitSenderFriendRequest
      ], function(error, result) {
        console.log(error, result);
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
    Friend.find({creator: req.user._id})
    .sort('-created')
    .exec(function(err, friends) {
      if (err) {
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
          if (item.usernameWaitFriendRequest) {
            testWait.push(item.usernameWaitFriendRequest);
          }
        });
        if (testFriend.indexOf(req.params.user) === 0) {
          return res.status(200).json(3);
        } else {
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
