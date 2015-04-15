/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Category = mongoose.model('Category');
var User      = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // CREATE CATEGORY //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addCategory: function(req, res) {
    console.log('__________POST /api/admin/addCategory_____');
    var category = new Category(req.body);
    category.save(function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(categorie);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE CATEGORY //////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeCategory: function(req, res) {
    console.log('___________DELETE /api/admin/removeCategorie_______');
    Category.remove({
      _id: req.params.id
    }, function(err) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(null);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // GET CATEGORIES ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getCategories: function(req, res) {
    console.log('********************* GET /api/categories ******************');
    Category.find().select('title id').exec(function(err, categories) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(categories);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // FIND USERS ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  users: function(req, res) {
    console.log('********************* find user ******************');
    User.find({}, function(err, docs) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(docs);
      }
    });
  },

  /////////////////////////////////////////////////////////////////
  // EDIT USER ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  editUser: function(req, res) {
    console.log('*********************edit user ******************');
    User.findOne({
      _id: req.params.id
    }, function(err, user) {
      user.username = req.body.username;
      user.password = req.body.password;
      user.role = req.body.role;
      user.reputation = req.body.reputation;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.age = req.body.age;
      user.locked = req.body.locked;
      User.emailExist(req.body.email, function(exist) {
        if (exist === false) {
          user.email = req.body.email;
        }
        user.save(function(err) {
          if (err) {
            res.status(400).json(null);
          } else {
            res.status(200).json(user);
          }
        });
      });
    });
  },
};
