
var filesCtrl = require('../controllers/filesCtrl');
var auth      = require('../authentification/auth');

var routes = [
  {
      path: '/api/upload/img',
      httpMethod: 'POST',
      middleware: [auth.ensureAuthenticated, filesCtrl.uploadImg]
  },
  {
      path: '/api/images',
      httpMethod: 'GET',
      middleware: [auth.ensureAuthenticated, filesCtrl.getImages]
  },
  {
      path: '/api/images/:id',
      httpMethod :'DELETE',
      middleware: [auth.ensureAuthenticated, filesCtrl.remove]
  },
];

module.exports = routes;
