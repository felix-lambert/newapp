var fs   = require('fs');
var Q    = require('q');
var lwip = require('lwip');

/* **** Error promise status **** */
// status = 1 : createDir error
// status = 2 : error moving file
// status = 3 : error writing thumbnail
// status = 4 : error saving image in db
// status = 5 : error removing file
/* ******** */

function fsExtender() {}

fsExtender.prototype._createDir = function(path) {
  var deferred = Q.defer();
  fs.mkdir(path, function(err) {
    if (err && (err.errno == 47 || err.code == 'EEXIST') || !err) {
      deferred.resolve();
    } else if (err) {
      deferred.reject({status:1, err:err});
    }
  });
  return deferred.promise;
};

fsExtender.prototype._moveFile = function(oldFile, newFile) {
  var deferred = Q.defer();
  fs.rename(oldFile, newFile, function(err) {
    if (err) {
      deferred.reject({status:2, err:err});
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};

fsExtender.prototype._makeThumb = function(file, thFile, tsize, data) {
  var deferred = Q.defer();

  lwip.open(file, function(err, image) {
    if (err || !image) {
      deferred.reject({status:3, err:err});
    } else {
      var width = image.width();
      var height = image.height();
      var twidth = tsize;
      var theight = tsize;
      //var toCrop = width > height ? height : width;
      //var offsetWidth = ((width - toCrop) / 2) > 0 ? ((width - toCrop) / 2) : 0;
      if (height < tsize || width < tsize) {
        twidth = width;
        theight = height;
      } else {
        if (width < height) {
          theight = Math.round(twidth * height / width);
        } else {
          twidth = Math.round(width * theight / height);
        }
      }
      image.batch()
      //.crop(offsetWidth, 0, toCrop + offsetWidth, toCrop)
      .resize(twidth, theight)
      .writeFile(thFile, function(err) {
        if (err) {
          deferred.reject({status:3, err:err});
        } else {
          deferred.resolve(data);
        }
      });
    }
  });
  return deferred.promise;
};

fsExtender.prototype._unlink = function(path) {
  var deferred = Q.defer();

  fs.unlink(path, function(err) {
    if (err && err.code != 'ENOENT') {
      deferred.reject({status:5, err:err});
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};

exports = module.exports = function() {
  var fsx = new fsExtender();
  return fsx;
};
