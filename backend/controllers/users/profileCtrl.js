/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var User         = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // EDIT PROFILE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  editProfile: function(req, res) {
    var obj = {};
    User.findOne({
        _id: req.user
    }, function(err, user) {
      User.findOne({
          'email': req.body.email
      }, function(err, docs) {
        if (!docs) {
          user.email = req.body.email;
          obj.email = req.body.email;
          obj.errorEmail = false;
        } else {
          obj.email = user.email;
          obj.errorEmail = true;
        }
        user.save(function(err) {
          if (err) {
            res.status(400).json(null);
          } else {
            res.status(200).json(obj);
          }
        });
      });
    });
  },

  defineProfileImage: function(req, res) {
    console.log('___defineProfileImage___');
    ImageModel.findOne({_id:req.body.id, author:req.user},
      function(err, image) {
      if (err || !image) {
        return res.status(500).json({
          message:'Erreur : Votre photo de profil n\'a pas pu être mis à jour.'
        });
      }
      req.user.profileImage = image._id;
      req.user.save(function(err) {
        if (err) {
          return res.status(500).json({
            message:'Erreur : Votre photo de profil n\'a pas pu être mis à jour.'
          });
        }
        return res.status(200).json({
          message: 'Votre photo de profil a été mise à jour.',
          image: image
        });
      });
    });
  }

};
