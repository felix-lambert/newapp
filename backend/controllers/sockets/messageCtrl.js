/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Message  = mongoose.model('Message');
var ee       = require('../../config/event');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // FIND MESSAGE BY ID ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  message: function(req, res, next, id) {
    console.log('***************load message*********************');
    Message.load(id, function(err, message) {
      if (err || !result) {
        findOneAnnounceCallback(err ? err : 'There is no message to load');
      }
      var messagePost = {
          _id: announce._id,
          created: announce.created,
          userCreator: {
              _id: message.userCreator._id,
              username: message.creator.username,
          },
          roomCreator: {
              _id: message.roomCreator._id,
              title: message.roomCreator.title,
          },
          type: message.type,
          slug: message.slug,
          __v: message.__v,
          updated: message.updated,
          content: message.content,
          room: message.room

      };
      req.message = messagePost;
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE A MESSAGE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  create: function(req, res) {
    console.log('*******************create message***************************');
    var message = new Message(req.body);

    message.save(function(err) {
      res.status(err ? 400 : 200).json(err ? err : message);
    });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL MESSAGES ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  all: function(req, res) {
    console.log('_______________________all messages______________________');
    Message.find({roomCreator: req.params.messageId}).sort('created')
      .exec(function(err, messages) {
        res.status(err ? 501 : 200).json(err ? err : messages);
      });
  },

  /////////////////////////////////////////////////////////////////
  // LIST USER MESSAGES ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  userMessage: function(req, res) {
    console.log('_______________________all messages______________________');
    Message.find({userRec: req.params.messageUsername})
      .sort('created').exec(function(err, messages) {
        res.status(err ? 501 : 200).json(err ? err : messages);
      });
  }
};
