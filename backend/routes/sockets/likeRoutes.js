/*
 * Module dependencies
 */
var path     = require('path');
var LikeCtrl = require('../../controllers/sockets/likeCtrl');
var auth     = require('../../authentification/auth');

/**
 * Defines routes for application
 */
var routes = [
{
     path: '/api/like/',
     httpMethod: 'GET',
     middleware: [auth.ensureAuthenticated, LikeCtrl.getLikes]
},
{
    path: '/api/like/',
    httpMethod: 'POST',
    middleware: [auth.ensureAuthenticated, LikeCtrl.saveLike]
},
{
    path: '/api/like/:idLike',
    httpMethod: 'DELETE',
    middleware: [auth.ensureAuthenticated, LikeCtrl.deleteLike]
}

];

module.exports = routes;
