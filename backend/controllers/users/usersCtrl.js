/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose     = require('mongoose');
var fs           = require('fs-extra');
var path         = require('path');
var crypto       = require('crypto');
var User         = mongoose.model('User');
var Notification = mongoose.model('Notification');
var Status       = mongoose.model('Status');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // UPLOAD IMAGE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  upload: function(req, res) {
    console.log('//////File caracteristics/////////');
    var destPath = path.join(__dirname, '../../frontend/images/');
    var originalFilename = req.files.file.originalFilename;
    var hashName = crypto.createHash('md5').
    update(originalFilename).digest('hex') + '.jpeg';
    var writeStream = req.files.file.ws;

    while (fs.existsSync(destPath + hashName)) {
      hashName = hashName.substring(0, hashName.length - 5);
      var rnd = crypto.randomBytes(3);
      var value = new Array(3);
      var len = hashName.length;
      for (var i = 0; i < 3; i++) {
        value[i] = hashName[rnd[i] % len];
      }
      hashName = hashName + value.join('') + '.jpeg';
    }
    fs.copy(writeStream.path, destPath + hashName, function(err) {
      if (err) {
        return res.send(err);
      }
      fs.chmodSync(destPath + hashName, '755');
      fs.remove(writeStream.path, function(err) {
        if (err) {
          return res.error(err);
        }
      });
    });
    var user = req.user;
    user.images.push(hashName);
    user.profileImage = hashName;
    user.save(function(err) {
      if (!err) {
        res.status(200).json({
          images: user.images
        });
      } else {
        console.log('Error: could not save image');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // SEARCH USER //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  search: function(req, res) {
    console.log('////////////////SEARCH////////////////////');
    var username;
    if (req.query.term) {
      username = req.user ? req.user.username : '';
      var search = req.query.term.toLowerCase();
      User.findUser(username, function(err, users) {
        if (err) {
          console.log('ERREUR');
          res.status(400).json(err);
        } else {
          res.status(200).json(users.filter(function(value) {
            return value[0].indexOf(search) !== -1;
          }));
        }
      });
    } else {
      res.status(200).end();
    }
  },

  /////////////////////////////////////////////////////////////////
  // SHOW PROFILE /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  show: function(req, res, next) {
    console.log('show user profile');
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
      if (err) {
        return next(new Error('Failed to load User'));
      }
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json('USER_NOT_FOUND');
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // CHECK USER EXIST /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  userExist: function(req, res) {
    var username = req.query.u;
    User.find({
      'username': username
    }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.status(ok ? 200 : 400).json({
              ok: ok
        });
      }, 500);
    });
  },

  /////////////////////////////////////////////////////////////////
  // CHECK EMAIL EXIST ////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  emailExist: function(req, res) {
    console.log('emailExist');
    var email = req.query.u;
    User.find({
        'email': email
    }).exec(function(err, user) {
      setTimeout(function() {
        var ok = !(user.length || err);
        res.status(ok ? 200 : 400).json({
            ok: ok
        });
      }, 500);
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET REPUTATION LISTING ///////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getReputation: function(req, res) {
    req.user.calculateReputation(function(reput) {
      res.status(200).json(reput);
    });
  },

  /////////////////////////////////////////////////////////////////
  // PROFILE //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  profile: function(req, res) {
    var user = req.user;

    var xUser = {
        email: user.email || user.facebook.email ||
        user.google.email || user.linkedIn.email,
        reputation: user.reputation,
        username: user.username || user.facebook.username ||
        user.google.username || user.linkedIn.username,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
    };
    res.status(201).json(xUser);
  },

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
        user.age = req.body.age;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
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
