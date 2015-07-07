/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var path           = require('path');
var morgan         = require('morgan');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var mongoStore     = require('connect-mongo')(expressSession);
var compress       = require('compression');
var bodyParser     = require('body-parser');

/////////////////////////////////////////////////////////////////
// CONFIGURATION ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
exports = module.exports = function(app, express, config) {

  console.log('///////////CONFIGURATION//////////////////');
  if (process.env.NODE_ENV === 'production') {
    app.set('views', __dirname + '/../../dist/views');
  } else {
    app.set('views', __dirname + '/../../frontend/views');
  }

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(compress());
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
      extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());
  if (process.env.NODE_ENV === 'production') {
    console.log('inside production');
    app.use(express.static(path.join(__dirname, '/../../dist')));
  } else {
    app.use(express.static(path.join(__dirname, '/../../frontend')));
  }
};
