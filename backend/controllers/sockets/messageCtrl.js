/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var Message  = mongoose.model('Message');

module.exports = {
  /////////////////////////////////////////////////////////////////
  // CREATE A MESSAGE /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  create: function(req, res) {
    console.log('*******************create message***************************');
    var message = new Message(req.body);
    console.log(req.body);
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
