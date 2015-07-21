'use strict';

var gulp = require('gulp');
var fs = require('fs');
var async = require('async');
var path = require('path');
var mkdirp = require('mkdirp');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var gutil = require('gutil');
var assign = require('lodash.assign');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
// var scripts = require('./gulp/scripts');
// var styles = require('./gulp/styles');
// var watch = require('./gulp/watch');
// var _ = require('lodash');
var spawn = require('child_process').spawn;

// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var rename = require('gulp-rename');
// var sass = require('gulp-sass');
// var minifyCss = require('gulp-minify-css');
var server = null;
var serverRunning = false;


/*
 * BROWSERIFY
 */
// add custom browserify options here
var customOpts = {
	entries: ['./assets/scripts/main.js'],
	debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform(babelify));

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

/*
 * SHARED TASKS
 */
gulp.task('client-components', function(next) {

	var componentsDir = './components';

	async.auto({
		mkdir: [function(cb) {
			mkdirp('./assets/scripts/components', cb);
		}],
		read: [function(cb) {
			fs.readdir(componentsDir, cb);
		}],
		filter: ['read', function(cb, data) {
			async.filter(data.read, function(file, cb1) {
				fs.stat(path.join(componentsDir, file), function(err, stat) {
					if(err) {
						return cb(false);
					}
					cb1(stat.isDirectory());
				});
			}, function(data1) {
				cb(null, data1);
			});
		}],
		write: ['mkdir', 'filter', function(cb, data) {
			require('node-jsx').install();

			// @todo override require to keep track of what modules are required

			async.each(data.filter, function(file, cb1) {
				var p = path.join(componentsDir, file);
				if(p.charAt(0) !== '/' && p.charAt(0) !== '.') {
					p = './' + p;
				}
				var comp = require(p);
				var f = genCompClientFile(comp);
				console.log(path.join('./assets/scripts/components', file));
				mkdirp(path.join('./assets/scripts/components', file), function(err, data) {
					fs.writeFile(
						path.join('./assets/scripts/components', file, 'index.js'),
						f,
						cb1
					);
				});
			}, cb);
		}]
	}, next);
});

function genCompClientFile(comp) {
	var requires = comp.prototype._willow.requires;
	var file = '\'use strict\';\n';
	file += 'var React = require(\'react\');\n';
	file += 'var Willow = require(\'willow-component\');\n';
	file += 'var compJson = '+comp.toString()+';\n';
	file += 'var Component = Willow.createClass(compJson.contents);\n';
	file += 'Component.prototype.requires = {};\n';

	for(var i in requires.both) {
		file += 'Component.prototype.requires[\''+i+'\'] = require(\''+requires.both[i]+'\');\n';
	}
	for(var j in requires.client) {
		file += 'Component.prototype.requires[\''+j+'\'] = require(\''+requires.client[i]+'\');\n';
	}
	file += 'module.exports = Component;\n';
	return file;
	// var requires = comp.requires();
	// var file = '';
	// file += 'var React = require(\'react\');\n';
	// file += 'var WillowComponent = require(\'willow-component/class\');\n';
	// file += 'var WillowError = require(\'willow-error\');\n';
	// file += 'var validator = require(\'validator\');\n';
	// file += 'var _ = require(\'lodash\');\n';
	// file += 'var underscoreDeepExtend = require(\'underscore-deep-extend\');\n';
	// file += 'var async = require(\'async\');\n';
	// file += 'var eventRunner = require(\'willow-component/libs/event-runner\');\n';
	// file += 'var comp = '+comp.toString()+';\n';
	// file += 'comp.contents.mixins = comp.contents.mixins || [];\n';
	// file += 'comp.contents.mixins.unshift({\n';
	// file += '	componentWillMount: function() {\n';
	// file += '		this.requires = {};\n';
	// for(var i in requires.both) {
	// 	file += '		this.requires[\''+i+'\'] = require(\''+requires.both[i]+'\');\n';
	// }
	// for(var j in requires.client) {
	// 	file += '		this.requires[\''+j+'\'] = require(\''+requires.client[j]+'\');\n';
	// }
	// file += '	}\n';
	// file += '});\n';
	// file += 'module.exports = (new WillowComponent(comp.contents, comp.events, comp.metadata, comp.requires)).build();';

	// return file;
}

gulp.task('bundle', bundle);

function bundle() {
	b.bundle()
	.on('error', function(e) {
		gutil.log('Browserify Error', e);
	})
	.pipe(source('./assets/scripts/main.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({
		loadMaps: true
	})) // loads map from browserify file
	.pipe(sourcemaps.write()) // writes .map file
	.pipe(rename('bundle.js'))
	.pipe(gulp.dest('./assets/scripts'));
}

// /*
//  * BUILD TASKS
//  */

// gulp.task('build', ['js', 'concat-css', 'sass', 'css-sass', 'templates', 'images', 'bower_components']);

// gulp.task('js', function() {
// 	var scriptPaths = _.map(scripts, function(script) {
// 		return 'assets'+script;
// 	});
// 	return gulp.src(scriptPaths)
// 	.pipe(concat('production.js'))
// 	.pipe(uglify())
// 	.pipe(gulp.dest('www/js'));
// });

// gulp.task('concat-css', function () {
// 	var stylePaths = _.map(styles, function(style) {
// 		return 'assets'+style;
// 	});
// 	return gulp.src(stylePaths)
// 	.pipe(concat('bundle.css'))
// 	.pipe(gulp.dest('www/css'));
// });

// gulp.task('sass', function () {
// 	return gulp.src('assets/styles/importer.scss')
// 	.pipe(sass().on('error', sass.logError))
// 	.pipe(gulp.dest('www/css'));
// });

// gulp.task('css-sass', function () {
// 	return gulp.src('www/css/*.css')
// 	.pipe(minifyCss({compatibility: 'ie8'}))
// 	.pipe(concat('production.css'))
// 	.pipe(gulp.dest('www/css'));
// });

// gulp.task('templates', function () {
// 	return gulp.src('assets/templates/**/*.html')
// 	.pipe(gulp.dest('www/templates'));
// });

// gulp.task('images', function () {
// 	return gulp.src('assets/images/**/*')
// 	.pipe(gulp.dest('www/images'));
// });

// gulp.task('bower_components', function () {
// 	return gulp.src('assets/bower_components/**/*')
// 	.pipe(gulp.dest('www/bower_components'));
// });

// /*
//  * SERVE TASKS
//  */

gulp.task('serve', ['client-components', 'bundle', 'server']);

// gulp.task('fonts', function () {
// 	return gulp.src('node_modules/font-awesome/fonts/*')
// 	.pipe(gulp.dest('public/fonts'));
// });

// gulp.task('sass-watch', function() {
// 	gulp.watch('public/styles/**/*.scss', ['sass-dev']);
// });

// gulp.task('sass-dev', function() {
// 	gulp.src('public/styles/user-portal.scss')
// 	.pipe(sass().on('error', sass.logError))
// 	.pipe(gulp.dest('public/css'));
// });

gulp.task('watch', function() {
	gulp.watch(
		[
			'queries/**/*.js',
			'libs/**/*.js',
			'config/**/*.js',
			'routes/**/*.js',
			'policies/**/*.js',
			'public/scripts/**/*.jsx',
			'app.js'
		],
		['server']
	);
});

gulp.task('server', function() {
	function startServer() {
		if(server && serverRunning) {
			console.log('Stopping server...');
			server.kill();
		}
		else {
			console.log('Starting server...');
			server = spawn('node', ['index']);
			serverRunning = true;
			server.on('close', function(code) {
				console.log('Server closed with code ['+code+']');
				serverRunning = false;
				startServer();
			});
			server.stdout.on('data', function(data) {
				console.log(data.toString());
			});
			server.stderr.on('data', function(data) {
				console.log(data.toString());
			});
		}
	}

	startServer();
});