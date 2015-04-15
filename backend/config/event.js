var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

exports = module.exports = function() {
  return ee;
};
