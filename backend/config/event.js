var EventEmitter = require('events').EventEmitter;
var ee           = new EventEmitter();

ee.on('error', function(err) {
  if (!err) {
    return ;
  }
  console.log('************** error **************');
  console.error(err);
  console.log('***********************************');
});

module.exports = ee;
