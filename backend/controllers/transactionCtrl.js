/*
 * Module dependencies
 */
var mongoose = require('mongoose');
var Announce = mongoose.model('Announce');
var Transaction = mongoose.model('Transaction');
var Comment = mongoose.model('AnnounceComment');
var User = mongoose.model('User');
var Q = require('q');

module.exports = {

  myMoney: function(req, res) {
    res.status(200).json({money:req.user.money});
  },

  create: function(req, res) {
    var tasks = [];
    var announceId = req.body.announce;
    var promise = Announce.findOne({_id: announceId, status:1})
    .populate('creator', 'username').exec();
    tasks.push(promise);
    promise = Transaction.findOne({
      announce: announceId, 'client.uId':req.user.id
    })
    .where('status').in([0, 1, 2])
    .exec();
    tasks.push(promise);

    Q.all(tasks)
    .then(function(results) {
      var announceRequested = results[0];
      var transaction = results[1];

      if (!announceRequested) {
        res.status(500).json({message:'Cette annonce n\'est plus disponible.'});
      }
      if (announceRequested && announceRequested.creator == req.user.id) {
        res.status(500).json({
          message:'Impossible de lancer une transaction sur votre propre annonce.'
        });
      }
      if (transaction) {
        res.status(500).json({
          message:'Vous possédez déjà une transaction en cours sur cette annonce'
        });
      } else {
        var transac = new Transaction({
          announce:announceId,
          client: {
              uId:req.user.id,
              username:req.user.username
          },
          owner: {
              uId:announceRequested.creator._id,
              username:announceRequested.creator.username
          },
        });
        if (req.body.clientprice) {
          transac.clientprice = req.body.clientprice;
        }
        transac.save(function(err, newTransac) {
          if (err) {
            res.status(500).json({error:'Error save transaction'});
          } else {
            res.status(200).end();
          }
        });
      }
    }, function(err) {
      res.status(500).json(err);
    });
  },

  getAll: function(req, res) {
    var tasks = [];

    tasks.push(Transaction.find({'client.uId': req.user.id})
        .populate('announce', 'title price')
        .exec());

    tasks.push(Transaction.find({'owner.uId': req.user.id})
        .populate('announce', 'title price')
        .exec());

    Q.all(tasks)
    .then(function(results) {
      res.status(200).json({
        client: results[0], owner:results[1], money:req.user.money
      });
    }, function(err) {
      res.status(500).json(err);
    });
  },

  reject: function(req, res) {
    Transaction.findOne({_id: req.params.id})
    .select('-clientprice -date')
    .exec(function(err, transac) {
      if (err || !transac) {
        return res.status(500).json({error:'transaction not found.'});
      }
      if (transac.status == -1) {
        return res.status(500).json({
          message:'Cette transaction est déjà annulé'
        });
      }
      if (!transac.announce) {
        return res.status(500).json({message:'Announce introuvable'});
      }
      if (!transac.owner || !transac.client)
        return res.status(500).json({message:"Utilisateur introuvable"});
      if (req.user.id != transac.client.uId &&
        req.user.id != transac.owner.uId) {
        return res.status(500).json({
          message:'Cette transaction ne vous concerne pas.',
          error:'Request accept from another user.'
        });
      }
      transac.status = -1,
      transac.statusInformation = req.user.username + ' a annulé la transaction.';
      if (req.user.id == transac.client.uId) {
        transac.client.status = -1;
      } else {
        transac.owner.status = -1;
      }
      Announce.update({_id:transac.announce._id}, {$set: {status: 1}}).exec();
      transac.save(function(err, doc) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(doc);
        }
      });
    });
  },

  accept: function(req, res) {
    var tasks = [];
    Transaction.findOne({_id: req.params.id})
    .populate('announce')
    .exec(function(err, transac) {
      if (err || !transac || transac.status == -1) {
        return res.status(500).json(err);
      }
      if (!transac.announce)
        return res.status(500).json({message:'Announce introuvable'});
      if (!transac.owner || !transac.client)
        return res.status(500).json({message:"Utilisateur introuvable"});
      if (req.user.id != transac.client.uId &&
        req.user.id != transac.owner.uId) {
        return res.status(500).json({
          message:'Cette transaction ne vous concerne pas.',
          error:'Request accept from another user.'
        });
      }
      if (req.user.id == transac.client.uId) {
        if (transac.client.status == 1) {
          return res.status(500).json({
            message: 'Vous avez déjà accepté cette transaction.'});
        }
        if ((req.user.money - transac.announce.price) < 0) {
          return res.status(500).json({
            message:'Vous n\'avez pas assez de crédits pour accepter cette transaction'
          });
        } else if (transac.client.status === 0) {
          transac.client.status = 1;
          transac.status = 1;
        }
      } else if (req.user.id == transac.owner.uId) {
        if (transac.owner.status == 1) {
          return res.status(500).json({
            message: 'Vous avez déjà accepté cette transaction.'
          });
        } else if (transac.owner.status === 0) {
          transac.owner.status = 1;
          transac.status = 1;
        }
      }
      if (transac.owner.status == 1 && transac.client.status == 1) {
        transac.status = 2;
        transac.statusInformation = 'En cours';
        Announce.update({_id:transac.announce._id}, {$set: {status: 2}}).exec(); // dont call pre save
      }

      transac.save(function(err) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(transac);
        }
      });
    });
  },

  received: function(req, res) {
    var tasks = [];
    Transaction.findOne({_id: req.params.id})
    .select('-clientprice -date')
    .populate('announce')
    .exec(function(err, transac) {
      if (err || !transac || transac.status == -1) {
        return res.status(500).json(err);
      }
      if (!transac.announce)
        return res.status(500).json({message:'Announce introuvable'});
      if (!transac.owner || !transac.client)
        return res.status(500).json({message:"Utilisateur introuvable"});
      if (req.user.id != transac.client.uId || transac.status != 2) {
        return res.status(500).json({
          message:'Vous ne pouvez pas effectuer cette action.'
        });
      }
      if (req.user.id.money - transac.announce.price < 0) {
        return res.status(500).json({
          message:'Vous n\'avez pas assez de crédit.'
        });
      }
      transac.client.status = 3;
      transac.status = 3;
      transac.statusInformation = 'Transaction effectuée.';

      tasks.push(transac.save());
      req.user.money -= transac.announce.price;
      tasks.push(req.user.save());
      tasks.push(User.findOne({_id: transac.owner.uId}).exec());
      Announce.update({_id:transac.announce._id}, {$set: {status: 3}}).exec();

      Q.all(tasks).then(function(results) {
        if (!results[2]) {
          return res.status(500).json({
            error:'Auteur de l\'annonce introuvable.'
          });
        }
        results[2].money += transac.announce.price;
        results[2].save();
        res.status(200).json({money:req.user.money, transac:transac});
      }, function(err) {
        res.status(500).json(err);
      });
    });
  },

  notReceived: function(req, res) {

  },

  postRating: function(req, res) {
    if (!req.body.rating || !req.body.comment) {
      return res.status(500).json({
        message:'Vous devez noter et commenter l\'annonce pour finir la transaction.'
      });
    }
    Transaction.findOne({
        _id: req.params.id
    }).populate('announce')
    .exec(function(err, transac) {
      if (err || !transac) {
        return res.status(500).json({error:'Transaction introuvable'});
      }
      var announce = transac.announce;
      if (transac.status != 2) {
        return res.status(500).json({
          message:'Vous ne pouvez pas noter l\'annonce pour l\'instant.'
        });
      }
      if (req.user.id != transac.client.uId) {
        return res.status(500).json({
          message:'Vous n\'etes pas autorisé à noter cette annonce.'
        });
      }
      if (announce.rating) {
        return res.status(200).end();
      }
      var tasks = [];
      var comment = new Comment({
          content: req.body.comment,
          author: req.user,
          announce: announce,
          rating: true
      });
      Announce.update(announce, {$set: {rating: req.body.rating}}).exec();
      announce.rating = req.body.rating;
      comment.save(function(err) {
        if (err) {
          res.status(500).json({error: 'couldn\'t save comment'});
        } else {
          res.status(200).end();
        }
      });
    });
  }
};
