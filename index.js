var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');

var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var bower = require('gulp-bower');


module.exports = function(gulp){

  gulp.task('angular-build', [
    'build-vendor', 'build-app-js', 'build-app-templates', 'build-app-less'
    ], function(){

  });

  gulp.task('build-app-js', function(){

  });

  gulp.task('build-app-templates', function(){

  });

  gulp.task('build-app-less', function(){

  });

  gulp.task('build-vendor', function() {
    var stream = gulp.src(mainBowerFiles())
    .pipe(debug({title: 'The bower vendor files'}))
    .pipe(concat('vendor.js'))
    .pipe(debug({title: 'The concated vendor files'}))
    .pipe(gulp.dest('./build/'));
    return stream;
  });

  gulp.task('build-vendor-dev', function() {
    var stream = gulp.src(mainBowerFiles({includeDev: true}))
    .pipe(debug({title: 'The bower vendor files'}))
    .pipe(concat('vendor.js'))
    .pipe(debug({title: 'The concated vendor files'}))
    .pipe(gulp.dest('./build/'));
    return stream;
  });

  gulp.task('bower', function() {
    bower();
  });

  gulp.task('clean', function(cb) {
    del(['./build'], cb);
  });
};
