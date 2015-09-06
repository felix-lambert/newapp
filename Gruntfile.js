module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist', '.tmp'],

    copy: {
        main: {
            expand: true,
            cwd: 'frontend/',
            src: [
            '**',
            '!angularMain/**',
            '!angularControllers/**',
            '!angularDirectives/**',
            '!angularFactories/**',
            '!angularFilters/**',
            '!angularLib/**',
            '!javascript/**',
            '!**/*.css'],
            dest: 'dist/'
        },
        shims: {
            expand: true,
            cwd: 'frontend/lib/webshim/shims',
            src: ['**'],
            dest: 'dist/js/shims'
        }
    },

    useminPrepare: {
        html: 'frontend/views/index.html'
    },

    usemin: {
      html: 'dist/views/index.html'
    },

    uglify: {
      options: {
        report: 'min',
        mangle: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-rev');

  // Tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask('default', [
    'copy',
    'useminPrepare',
    'uglify',
    'usemin',
    'concat',
    'cssmin'
  ]);

  grunt.registerTask('heroku', [
    'copy',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin']);
};
