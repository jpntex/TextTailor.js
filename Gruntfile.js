module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.title %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> | https://github.com/jpntex/TextTailor.js | Copyright (c) 2014 João Teixeira (@jpntex) | MIT License */\n'
			},
			build: {
				src: 'jquery.texttailor.js',
				dest: 'dist/jquery.texttailor.min.js'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'jquery.texttailor.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	grunt.registerTask('default', ['jshint', 'uglify']);
};