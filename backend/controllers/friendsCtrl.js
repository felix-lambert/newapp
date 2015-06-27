/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Friend   = mongoose.model('Friend');
var User     = mongoose.model('User');
var ee       = require('../config/event');

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

    function testIfFriendRequestDone(userId) {
      Friend.findOne({
        creator: req.body.idUser
      }).exec(function(err, result) {
        if (result && result.length > 0) {
          console.log('Friend request already done');
          return false;
        } else {
          return true;
        }
      });
    }

    function saveFriend(friend, user) {
      Friend.findOneAndUpdate({
        $and: [
        {creator: friend.idUser},
        {usernameWaitFriendRequest: user.username}
        ]
      }, {
        usernameAcceptedFriendRequest: user.username,
      }, {upsert: true}).exec(function(err, userOne) {
        if (err) {
          ee.emit('error', err);
          return res.status(500).json(err);
        } else {
          Friend.findOneAndUpdate({
            $and: [
              {creator: user._id},
              {usernameWaitFriendRequest: friend.usernameAcceptedFriendRequest}
            ]
          }, {
            usernameAcceptedFriendRequest: friend.usernameAcceptedFriendRequest,
          }, {upsert: true}).exec(function(err, result) {
            if (err) {
              ee.emit('error', err);
              return res.status(500).json(err);
            } else {
              return res.status(200).json(result);
            }
          });
        }
      });
    }

    function saveWaitFriendRequest(user, friend) {
      var firstFriend = new Friend();
      var waitFriendRequest = friend.usernameWaitFriendRequest;
      firstFriend.usernameWaitFriendRequest = waitFriendRequest;
      firstFriend.creator = user._id;
      firstFriend.save(function(err, doc) {
        if (err) {
          ee.emit('error', err);
          return res.status(500).json(err);
        } else {
          var secondFriend = new Friend();
          secondFriend.usernameWaitFriendRequest = user.username;
          secondFriend.save(function(err, doc) {
            if (err) {
              ee.emit('error', err);
              return res.status(500).json(err);
            } else {
              return res.status(200).json(doc);
            }
          });
        }
      });
    }

    if (req.body.usernameAcceptedFriendRequest) {
      console.log('username accepted');
      saveFriend(req.body, req.user);
    } else if (req.body.usernameWaitFriendRequest) {
      console.log('username wait');
      testIfFriendRequestDone(req.body.idUser);
      testIfFriendRequestDone(req.user._id);
      saveWaitFriendRequest(req.user, req.body);
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
