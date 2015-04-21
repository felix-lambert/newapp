/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Friend   = mongoose.model('Friend');
var User     = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET FRIEND BY ID /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getFriend: function(req, res, next, id) {
    console.log('________________load friend__________________________');
    Friend.load(id, function(err, friend) {
      if (err) {
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
  // SHOW A FRIEND ////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  show: function(req, res) {
    console.log('show friend');
    res.status(200).json(req.friend);
  },

  /////////////////////////////////////////////////////////////////
  // CREATE A FRIEND //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  postFriend: function(req, res) {
    console.log('______ POST /api/friends (new friend) _____');
    if (req.body.refuse) {
      console.log('inside ');
      Friend.findOne({
        creator: req.body.idUser
      }).exec(function(err, result) {
        console.log('refuse');
        result.remove();
      });
      Friend.findOne({
        creator: req.user._id
      }).exec(function(err, result) {
        console.log('refuse');
        result.remove();
      });
      return;
    } else if (req.body.usernameAcceptedFriendRequest) {
      console.log('username accepted');
      Friend.findOneAndUpdate({
        $and: [
        {creator: req.body.idUser},
        {usernameWaitFriendRequest: req.user.username}
        ]
      }, {
        usernameAcceptedFriendRequest: req.user.username,
      }, {upsert: true}).exec(function(err, userOne) {
        if (err) {
          return res.status(500).json(err);
        } else {
          Friend.findOneAndUpdate({
            $and: [
              {creator: req.user._id},
              {usernameWaitFriendRequest: req.body.usernameAcceptedFriendRequest}
            ]
          }, {
            usernameAcceptedFriendRequest: req.body.usernameAcceptedFriendRequest,
          }, {upsert: true}).exec(function(err, result) {
            if (err) {
              return res.status(500).json(err);
            } else {
              return res.status(200).json(result);
            }
          });
        }
      });
    } else if (req.body.usernameWaitFriendRequest) {
      console.log('username wait');
      Friend.findOne({
        creator: req.body.idUser
      }).exec(function(err, result) {
        if (result && result.length > 0) {
          console.log('Friend request already done');
          return;
        }
      });
      Friend.findOne({
        creator: req.user._id
      }).exec(function(err, result) {
        if (result && result.length > 0) {
          console.log('Friend request already done');
          return;
        }
      });
      var friend = new Friend();
      var waitFriendRequest = req.body.usernameWaitFriendRequest;
      friend.usernameWaitFriendRequest = waitFriendRequest;
      friend.creator = req.user._id;
      friend.save(function(err, doc) {
        if (err) {
          return res.status(500).json(err);
        } else {
          var secondFriend = new Friend();
          secondFriend.usernameWaitFriendRequest = req.user.username;
          secondFriend.save(function(err, doc) {
            if (err) {
              return res.status(500).json(err);
            } else {
              return res.status(400).json(doc);
            }
          });
        }
      });
    }
  },

  /////////////////////////////////////////////////////////////////
  // DELETE A FRIEND //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  deleteFriend: function(req, res) {
    console.log('_________destroy friend_____________');
    var friend = req.friend;
    Friend.remove(friend, function(err) {
      if (err) {
        console.log(err);
        res.status(400).json(err);
      } else {
        res.status(200).json(friend);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET FRIENDS FROM USER ////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getFriendsFromUser: function(req, res) {
    console.log('_____________________GET FRIENDS FROM USER________________');
    Friend.find({
            creator: req.params.userId
        })
        .sort('-created')
        .exec(function(err, friends) {
          if (err) {
            res.status(501).json(err);
          } else {
            for (i = 0; i < friends.length; i++) {
              sendFriends.push(friends[i].usernameWaitFriendRequest);
            }
            res.status(200).json(friends);
          }
        });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL FRIENDS//////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getAllFriends: function(req, res) {
    console.log('************** Get All Friends **********');
    var sendFriends = [];
    Friend.find({creator: req.params.friendId})
        .sort('-created')
        .exec(function(err, friends) {
          if (err) {
            console.log('ERREUR');
            res.status(501).json(err);
          } else {
            for (var i = 0; i < friends.length; i++) {
              if (friends[i].usernameAcceptedFriendRequest) {
                sendFriends.push({
                    accepted: friends[i].usernameAcceptedFriendRequest
                });
              } else if (friends[i].usernameWaitFriendRequest) {
                sendFriends.push({
                    wait: friends[i].usernameWaitFriendRequest
                });
              }
            }
            console.log('///////////////////////////');
            console.log(sendFriends);
            res.status(200).json(sendFriends);
          }
        });
  }
};
