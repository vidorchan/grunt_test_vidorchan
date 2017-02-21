//KeyWords: Task,Target,Options
/**
 move generated file into specific dir
 */
var fixGeneratedPaths = function(generatedPath, files) {
	for (var property in files) {
		// if (files.hasOwnProperty(property)) {
		files[generatedPath + property] = files[property];
		delete files[property];
		// }
	}
	return files;
};

module.exports = function(grunt) {

	var gruntOutputPath = './build/grunt';

	var jsGeneratedPath = gruntOutputPath + '/generated/js/';
	var cssGeneratedPath = gruntOutputPath + '/generated/css/';

	// Project configuration.
	grunt.initConfig({
		pkg: JSON.parse(grunt.file.read('package.json')),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */' //add the comments into the first line of minified js
					//sourceMap: true  easy to debug js
			},
			all: {
				files: '<%= pkg.projectFiles.jsMinFiles %>' //assign js files
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: '<%= pkg.projectFiles.cssMinFiles %>', //assign the css dir
					src: ['*.css', '!*.min.css'],
					dest: cssGeneratedPath, //locate the generated minified css dir
					ext: '.min.css'
				}]
			}
		},
		jshint: {
			options: {
				jshintrc: 'jshintrc.json' //use rules defined in jshintrc to check js files
			},
			all: ['Gruntfile.js', 'src/**/*.js'] //assign the js files need to be checked
		},
		csslint: {
			options: {
				csslintrc: 'csslintrc.json' //use rules defined in csslintrc to check css files
			},
			strict: {
				options: {
					import: 1
				},
				src: ['src/**/*.css']
			}
		},
		watch: {
			scripts: {
				files: ['Gruntfile.js', 'src/**/*.js', 'src/**/*.css'],
				tasks: ['jshint:all', 'csslint', 'uglify:all'],
				options: {
					interrupt: true,
					livereload: true;
				}
			}
		}
	});

	grunt.config.data.uglify.all.files = fixGeneratedPaths(jsGeneratedPath, grunt.config.process(grunt.config.data.uglify.all.files));

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask(
		'default',
		'Runs all the tests, analyzes code quality, and produces reports', ['jshint', 'uglify', 'csslint', 'cssmin', 'watch']
	);
};