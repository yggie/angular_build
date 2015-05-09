var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');

var webserver = require('gulp-webserver');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var livereload = require('gulp-livereload');

module.exports = function(gulp){

  var config = {
    files: {
      js: {
        app: ['src/**/*.js']
      },
      html: {
        app: ['src/**/*.html']
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

    livereload.listen({
      quiet: true
    });
  });

  function buildApplicationJavascript(){
    var stream = gulp.src(config.files.js.app)
      .pipe(concat('application.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-js', function(){
    return buildApplicationJavascript();
  });

  function buildApplicationHtml (argument) {
    var stream = gulp.src(config.files.html.app)
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-html', function(){
    return buildApplicationHtml();
  });

  gulp.task('build-app-templates', function(){

  });

  gulp.task('build-app-less', function(){

  });

  gulp.task('build-vendor', function() {
    var stream = gulp.src(mainBowerFiles())
      .pipe(debug({title: 'Vendor Files:'}))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
  });

  gulp.task('build-vendor-dev', function() {
    var stream = gulp.src(mainBowerFiles({includeDev: true}))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
  });

  gulp.task('bower', function() {
    bower();
  });

  gulp.task('clean', function(cb) {
    del(['./build'], cb);
  });
};
