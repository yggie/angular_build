var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');

var webserver = require('gulp-webserver');
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

  gulp.task('webserver', ['watch'], function(){
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
    gulp.watch(config.files.js.app, ['build-app-js']);
    gulp.watch(config.files.html.app, ['build-app-html']);
    livereload.listen({
      quiet: true
    });
  });

  gulp.task('build-app-js', function(){
    var stream = gulp.src(config.files.js.app)
      .pipe(concat('application.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
  });

  gulp.task('build-app-html', function(){
    var stream = gulp.src(config.files.html.app)
      .pipe(gulp.dest('./build/'))
      .pipe(livereload());
    return stream;
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
