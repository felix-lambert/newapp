module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      clean: ['dist', '.tmp'],

      shell: {
        'git-add-dist': {
          command: 'git add .'
        },
        'git-commit-build': {
          command: 'git commit -am "build"'
        },
        'heroku': {
          command: 'git push heroku master'
        }
      },

      copy: {
          main: {
              expand: true,
              cwd: 'frontend/',
              src: [
              '**',
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

      rev: {
          files: {
              src: ['dist/**/*.{js,css}', '!dist/js/shims/**']
          }
      },

      useminPrepare: {
          html: 'frontend/views/index.html'
      },

      usemin: {
          html: ['dist/views/index.html']
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
  grunt.loadNpmTasks('grunt-shell');

  // Tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask('default', [
    'copy',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin',
    'shell:git-add-dist',
    'shell:git-commit-build',
    'shell: heroku'
  ]);
};
