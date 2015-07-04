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
  // GET FRIEND BY ID /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getFriend: function(req, res, next, id) {
    console.log('________________load friend__________________________');
    Friend.load(id, function(err, friend) {
      if (err) {
        ee.emit('error', err);
        return next(err);
      }
      if (!friend) {
        return next(new Error('Failed to load friend ' + id));
      }
      var friendPost = {
          _id: friend._id,
          created: friend.created,
          creator: {
              _id: friend.creator._id,
              username: friend.creator.username,
              usernameFacebook: friend.creator.facebook.username,
              usernameGoogle: friend.creator.google.username,
              usernameLinkedIn: friend.creator.linkedIn.username,
          },
          username: friend.usernameWaitFriendRequest,
          slug: friend.slug,
          __v: friend.__v,
          updated: friend.updated
      };
      req.friend = friendPost;
      next();
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE A FRIEND //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postFriend: function(req, res) {

    function saveReceiverFriendRequest(saveReceiverFriendRequestCallback) {
      Friend.saveFriend(req.body.idUser, req.user.username, function(error, result) {
        if (error) {
          saveReceiverFriendRequestCallback(error);
        } else {
          saveReceiverFriendRequestCallback(null);
        }
      });
    }

    function saveSenderFriendRequest(saveSenderFriendRequestCallback) {
      Friend.saveFriend(req.body.idUser, req.user.username, function(error, result) {
        if (error) {
          saveSenderFriendRequestCallback(error);
        } else {
          saveSenderFriendRequestCallback(null);
        }
      });
    }

    function testIfReceiverFriendRequestDone(testIfReceiverFriendRequestDoneCallback) {
      Friend.testIfFriendRequestDone(req.body.idUser, function(result) {
        if (result === false) {
          testIfReceiverFriendRequestDoneCallback('friend request already done');
        } else {
          testIfReceiverFriendRequestDoneCallback(null);
        }
      });
    }

    function testIfSenderFriendRequestDone(testIfSenderFriendRequestDoneCallback) {
      Friend.testIfFriendRequestDone(req.user._id, function(result) {
        if (result === false) {
          testIfSenderFriendRequestDoneCallback('friend request already done');
        } else {
          testIfSenderFriendRequestDoneCallback(null);
        }
      });
    }

    function saveWaitReceiverFriendRequest(saveWaitReceiverFriendRequestCallback) {
      var friend = new Friend();
      var waitFriendRequest = req.body.usernameWaitFriendRequest;
      friend.usernameWaitFriendRequest = waitFriendRequest;
      friend.creator = req.user._id;
      friend.save(function(err, doc) {
        if (err) {
          saveWaitReceiverFriendRequestCallback(err);
        } else {
          saveWaitReceiverFriendRequestCallback(null);
        }
      });

    }

    function saveWaitSenderFriendRequest(saveWaitSenderFriendRequestCallback) {
      var friend = new Friend();
      var waitFriendRequest = req.body.usernameWaitFriendRequest;
      friend.usernameWaitFriendRequest = req.user.username;
      friend.creator = req.user._id;
      friend.save(function(err, doc) {
        if (err) {
          saveWaitReceiverFriendRequestCallback(err);
        } else {
          saveWaitReceiverFriendRequestCallback(null);
        }
      });

    }

    if (req.body.usernameAcceptedFriendRequest) {
      // Faire une promise
      async.waterfall([saveReceiverFriendRequest, saveSenderFriendRequest], function(error, result) {
        if (error) {
          //handle readFile error or processFile error here
          ee.emit('error', error);
          res.status(400).json(error);
        } else {
          res.status(200).json();
        }
      });
    } else if (req.body.usernameWaitFriendRequest) {

      // Faire une promise
      async.waterfall([
        testIfReceiverFriendRequestDone,
        testIfSenderFriendRequestDone,
        saveWaitReceiverFriendRequest,
        saveWaitSenderFriendRequest
      ], function(error, result) {
        if (error) {
          //handle readFile error or processFile error here
          ee.emit('error', error);
          res.status(400).json(error);
        } else {
          res.status(200).json();
        }
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
      res.status(200).json();
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
          if (testWait.indexOf(req.params.user) === 0) {
            res.status(200).json(2);
          } else {
            res.status(200).json(1);
          }
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
