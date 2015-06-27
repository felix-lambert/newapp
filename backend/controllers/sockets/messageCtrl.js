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
      if (err) {
        ee.emit('error', err);
        return next(err);
      }
      if (!announce) {
        return next(new Error('Failed to load message ' + id));
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
      next();
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE A MESSAGE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  create: function(req, res) {
    console.log('*******************create message***************************');
    var message = new Message(req.body);

    message.save(function(err) {
      if (err) {
        ee.emit('error', err);
        res.status(400).json(err);
      } else {
        res.status(201).json(message);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // LIST ALL MESSAGES ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  all: function(req, res) {
    console.log('_______________________all messages______________________');
    Message.find({roomCreator: req.params.messageId}).sort('created')
      .exec(function(err, messages) {
        if (err) {
          ee.emit('error', err);
          res.status(501).json(err);
        } else {
          res.status(200).json(messages);
        }
      });
  },

  /////////////////////////////////////////////////////////////////
  // LIST USER MESSAGES ///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  userMessage: function(req, res) {
    console.log('_______________________all messages______________________');
    Message.find({userRec: req.params.messageUsername})
      .sort('created').exec(function(err, messages) {
        if (err) {
          ee.emit('error', err);
          res.status(501).json(err);
        } else {
          res.status(200).json(messages);
        }
      });
  }
};
