module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: [
              'backend/authentification/passport/passportSocial.js',
              'backend/authentification/auth.js',
              'backend/authentification/passportStrategy.js',
              'backent/socket.io/*',
              'backend/config/config.js',
              'backend/controllers/filesCtrl.js',
              'backend/controllers/friendNotificationCtrl.js',
              'backend/controllers/friendsCtrl.js',
              'backend/controllers/notificationCtrl.js',
              'backend/controllers/statusCtrl.js',
              'backend/controllers/transactionCtrl.js',
              'backend/db/*',
              'backend/models/models.js',
              'backend/models/schemas/announceSchemas/AnnounceCommentModel.js',
              'backend/models/schemas/announceSchemas/AnnounceModel.js',
              'backend/models/schemas/announceSchemas/CategoryModel.js',
              'backend/models/schemas/chatSchemas/MessageModel.js',
              'backend/models/schemas/chatSchemas/RoomModel.js',
              'backend/models/schemas/userSchemas/FriendModel.js',
              'backend/models/schemas/userSchemas/FriendNotificationModel.js',
              'backend/models/schemas/userSchemas/ImageModel.js',
              'backend/models/schemas/userSchemas/NotificationModel.js',
              'backend/models/schemas/userSchemas/StatusModel.js',
              'backend/models/schemas/userSchemas/TokenModel.js',
              'backend/models/schemas/userSchemas/UserModel.js',
              'backend/routes/announces/*',
              'backend/routes/sessions/*',
              'backend/routes/sockets/*',
              'frontend/app.js',
              'frontend/angularConstant/config.js',
              'frontend/angularConstant/geolocation_msgs.js',
              'frontend/angularConstant/useragentmsgs.js',
              'frontend/angularControlers/AdminNavbarAngCtrl.js',
              'frontend/angularControlers/AnnouncesAngCtrl.js',
              'frontend/angularControlers/ForgotAngCtrl.js',
              'frontend/angularControlers/MainAngCtrl.js',
              'frontend/angularControlers/MainHeaderAngCtrl.js',
              'frontend/angularControlers/NavbarAngCtrl.js',
              'frontend/angularControlers/PaginationAngCtrl.js',
              'frontend/angularControllers/admin/*',
              'frontend/angularControllers/modal/*',
              'frontend/angularControllers/profile/*',
              'frontend/angularDirectives/*.js',
              'frontend/angularFactories/*.js',
              'frontend/angularFactories/announces/*.js',
              'frontend/angularFactories/auth/*.js',
              'frontend/angularFactories/socket/*.js',
              'frontend/angularFilters/*.js',
              'frontend/angularLib/angular.js',
              'frontend/angularLib/angular-animate.js',
              'frontend/angularLib/ui-bootstrap-tpls.js',
              'frontend/angularLib/socket.io.js',
              'frontend/angularLib/angular-file-upload.js',
              'frontend/angularLib/angular-route.js',
              'frontend/angularLib/angular-resource.js',
              'frontend/angularLib/angular-messages.js',
              'frontend/angularLib/toaster.js',
              'frontend/javascript/*.js'
        ],
        dest: 'build/minifiedProject.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('heroku', ['uglify']);

};
