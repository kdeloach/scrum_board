module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            files: ['**/*.js'],
            tasks: ['jshint']
        },
        jshint: {
            all: ['Gruntfile.js', 'static/js/common.js', 'static/js/app/**/*.js']
        }
    });
};