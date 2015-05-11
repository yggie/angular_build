var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');

var webserver = require('gulp-webserver');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var livereload = require('gulp-livereload');
var templateCache = require('gulp-angular-templatecache');
var cachebreaker = require('gulp-cache-breaker');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');

module.exports = function(gulp){

  var config = {
    build_dir: './build/',
    files: {
      js: {
        app: ['src/**/*.js', '!src/**/*.spec.js'],
        spec: 'src/**/*.spec.js',
        templates: 'src/**/*.tpl.html'
      },
      html: {
        app: ['src/**/*.html', '!src/**/*.tpl.html']
      }
    }
  };

  gulp.task('webserver', ['angular-build', 'watch'], function(){
    gulp.src('build')
      .pipe(webserver({
        host: '0.0.0.0',
        port: 8000
      }));
  });

  gulp.task('angular-build', [
    'build-vendor', 'build-app-js', 'build-app-html','build-app-templates', 'build-app-less'
    ], function(){

  });

  gulp.task('watch', function() {
    watch(config.files.js.app, {
      verbose: true
    },
    function(vinyl){
      buildApplicationJavascript();
    });

    watch(config.files.html.app, {
      verbose: true
    },
    function(vinyl){
      buildApplicationHtml();
    });

    watch(config.files.js.templates, {
      verbose: true
    },
    function(vinyl){
      buildApplicationTemplates();
    });

    livereload.listen({
      quiet: true
    });
  });

  gulp.task('spec', ['angular-build'], function() {
    var stream = gulp.src([
        'build/vendor.js',
        'build/templates.js',
        'build/application.js',
        'src/**/*.spec.js',
      ])
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
    return stream;
  });

  function buildApplicationJavascript(){
    var stream = gulp.src(config.files.js.app)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('application.js'))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-js', function(){
    return buildApplicationJavascript();
  });

  function buildApplicationHtml () {
    var stream = gulp.src(config.files.html.app)
      .pipe(gulp.dest(config.build_dir))
      .pipe(cachebreaker(config.build_dir))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-html', function(){
    return buildApplicationHtml();
  });

  function buildApplicationTemplates(){
    var stream = gulp.src(config.files.js.templates)
      .pipe(templateCache('templates.js', {
        standalone: true
      }))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  };

  gulp.task('build-app-templates', function(){
    return buildApplicationTemplates();
  });

  gulp.task('build-app-less', function(){

  });

  gulp.task('build-vendor', function() {
    var stream = gulp.src(mainBowerFiles())
      .pipe(debug({title: 'Vendor Files:'}))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  });

  gulp.task('build-vendor-dev', function() {
    var stream = gulp.src(mainBowerFiles({includeDev: true}))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  });

  gulp.task('bower', function() {
    bower();
  });

  gulp.task('clean', function(cb) {
    del([config.build_dir], cb);
  });
};
