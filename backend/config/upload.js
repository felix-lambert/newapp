var multer  = require('multer');
var ee = require('./event')();

exports = module.exports = function(app) {
  console.log('upload configuration');
  var files = 0;
  var filesLimit = 20;

  ee.on('uploadCompleted', function() {
    console.log('upload completed ! ');
    files = 0;
  });

  app.use(multer({
      dest: './frontend/uploads/',
      limits: {
          fileSize: 20 * 1024 * 1024, // 5mb
          files:filesLimit,
      },
      onFileUploadStart: function(file, req, res) {
        if (files > filesLimit) {
          return false;
        }
        files++;
        return true;
      },
      onFileUploadComplete : function(file, req, res) {
        return true;
      }
  }));
};
