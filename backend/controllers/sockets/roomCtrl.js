/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Room     = mongoose.model('Room');
var async    = require('async');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE ROOM //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  create: function(req, res) {
    console.log('______CREATE ROOM TEST__________________');

    var usernames = new Array(req.body.nameRec, req.user.username);

    usernames.sort(alphabetical);

    roomName = usernames.join('');
    console.log('roomname... ');
    console.log(roomName);
    Room.find({name: roomName}, function(err, results) {
      var room = [];
      console.log(results);
      if (!results || results.length > 0) {
        res.status(201).json({
          roomName : results[0].name,
          roomId : results[0]._id,
          status: 'join'
        });
      } else {
        room = new Room({
          name: roomName
        });
        console.log('save room');
        room.save(function(err, saveRoom) {
          res.status(err ? 400 : 200).json(err ? err : {
            roomId: saveRoom._id,
            roomName: saveRoom.name,
            status: 'create'
          });
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
        findOneRoomCallback(err ? err : null, room);
      });
    }

    function saveRoom(room, saveRoomCallback) {
      room.title = req.body.title;
      room.save(function(err) {
        saveRoomCallback(err ? err : null, room);
      });
    }

    // Faire une promise
    async.waterfall([findOneRoom, saveRoom], function(error, result) {
      res.status(error ? 400 : 200).json(error ? error : result);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE ROOM //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  destroy: function(req, res) {
    console.log('******************destroy room****************************');
    var room = req.room;
    Room.remove(room, function(err) {
      res.status(err ? 400 : 200).json(err ? err : room);
    });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL ROOMS ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  all: function(req, res) {
    console.log('all rooms');
    Room.find().sort('-created').exec(function(err, rooms) {
      res.status(err ? 400 : 200).json(err ? err : rooms);
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
