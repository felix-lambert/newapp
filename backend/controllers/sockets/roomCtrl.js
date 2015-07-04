/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Room     = mongoose.model('Room');
var ee       = require('../../config/event');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // FIND ROOM BY ID //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  room: function(req, res, next, id) {
    console.log('***************load announce room*********************');
    Room.load(id, function(err, room) {
      if (err) {
        ee.emit('error', err);
        return next(err);
      }
      if (!room) {
        return next(new Error('Failed to loannounce room ' + id));
      }
      var roomPost = {
          _id: room._id,
          created: room.created,
          creator: {
              _id: room.creator._id,
              username: room.creator.username,
          },
          title: room.title,
          slug: announce.slug,
          __v: announce.__v,
          updated: announce.updated,
      };
      req.room = roomPost;
      next();
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE ROOM //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  create: function(req, res) {
    console.log('______CREATE ROOM TEST__________________');

    var usernames = new Array(req.body.nameRec, req.body.name);

    usernames.sort(alphabetical);

    roomName = usernames.join('');
    Room.find({name: roomName}, function(err, results) {
      var room = [];
      if (results && results.length > 0) {
        res.status(201).json({
          roomName : results[0].name,
          roomId : results[0]._id,
          status: 'join'
        });
      } else {
        room = new Room({
            name: roomName
        });
        room.save(function(err, saveRoom) {
          if (err) {
            ee.emit('error', err);
            res.status(400).json(err);
          } else {
            res.status(201).json({
              roomId: saveRoom._id,
              roomName: saveRoom.name,
              status: 'create'
            });
          }
        });
      }
    });

  },

  /////////////////////////////////////////////////////////////////
  // UPDATE ROOM //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  update: function(req, res) {
    console.log('*****************Update room*******************');
    function findOneRoom(findOneRoomCallback) {
      Room.findOne({
        '_id': req.room._id
      }, function(err, room) {
        if (err) {
          findOneRoomCallback(err);
        } else {
          findOneRoomCallback(null, room);
        }
      });
    }

    function saveRoom(room, saveRoomCallback) {
      room.title = req.body.title;
      room.save(function(err) {
        if (err) {
          saveRoomCallback(err);
        } else {
          saveRoomCallback(null, room);
        }
      });
    }

    // Faire une promise
    async.waterfall([findOneRoom, saveRoom], function(error, result) {
      if (error) {
        //handle readFile error or processFile error here
        ee.emit('error', error);
        res.status(400).json(error);
      } else {
        res.status(200).json(result);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE ROOM //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  destroy: function(req, res) {
    console.log('******************destroy room****************************');
    var room = req.room;
    Room.remove(room, function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(room);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL ROOMS ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  all: function(req, res) {
    console.log('all rooms');
    Room.find().sort('-created')
      .exec(function(err, rooms) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(rooms);
        }
      });
  }
};

function alphabetical(a, b) {
  var A = a.toLowerCase();
  var B = b.toLowerCase();
  if (A < B) {
    return -1;
  } else if (A > B) {
    return 1;
  } else {
    return 0;
  }
}
