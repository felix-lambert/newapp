/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var mongoose  = require('mongoose');
var Actuality = mongoose.model('Actuality');
var User      = mongoose.model('User');

module.exports = {

  /////////////////////////////////////////////////////////////////
  // GET STATUS ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  getActualities: function(req, res) {
    console.log('_____GET /api/actuality');
    Actuality.find()
    .sort('-date')
    .exec(function(err, actualities) {
      return res.status(err ? 501 : 200).json(err ? err : actualities);
    });
  },

  /////////////////////////////////////////////////////////////////
  // CREATE COMMENT ///////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  addActuality: function(req, res) {
    console.log('_______ADD Actuality_____');
    var actuality     = new Actuality();
    actuality.content = req.body.content;
    actuality.status  = req.body.status;
    actuality.creator = req.user._id;
    actuality.save(function(err) {
      res.status(err ? 400 : 200).json(err ? err : null);
    });
  },

  /////////////////////////////////////////////////////////////////
  // DELETE ACTUALITY /////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  removeActuality: function(req, res) {
    console.log('______DELETE /api/actuality___');
    function findOneActuality(findOneActualityCallback) {
      Actuality.findOne({
        _id: req.params.id
      }, function(err, result) {
        findOneActualityCallback(err ? err : null, result);
      });
    }

    function removeActuality(result, removeActualityCallback) {
      if (req.user._id == result.creator) {
        Actuality.remove(result, function(err) {
          removeActualityCallback(err ? err : null);
        });
      } else {
        removeActualityCallback('error in remove actuality');
      }
    }

    // Faire une promise
    async.waterfall([findOneActuality, removeActuality], function(error) {
      console.log(error ? error : null);
      res.status(error ? 400 : 200).json(error ? error : null);
    });
  },
};
