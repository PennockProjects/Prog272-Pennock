module.exports = function(grunt) { 'use strict';

	grunt.initConfig({
		jshint: {
			files: ['**/*.js'],

			options: {
				ignores: [
					'**/coverage/**',
					'**/node_modules/**',
					'**/angular.js',
					'**/angular-mocks.js',
					'**/jquery*.js',
					'**/bootstrap.min.js',
					'**/crafty.js',
					'**/showdown.js',
					'**/qunit-1.13.0.css',
					'**/qunit-1.13.0.js'
				],
				reporter: 'checkstyle',
				reporterOutput: 'result.xml',
				strict: true,
				newcap: false,
				globals: {
					describe: true,
					afterEach: true,
					beforeEach: true,
					inject: true,
					it: true,
					jasmine: true,
					expect: true,
					angular: true,
					module: true,
					Crafty: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('default', ['jshint']);
};
