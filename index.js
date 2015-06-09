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
var sass = require('gulp-sass');

module.exports = function(gulp){

  var config = {
    build_dir: './build/',
    files: {
      js: {
        app: ['src/**/*.js', '!src/**/*.spec.js'],
        spec: 'src/**/*.spec.js',
        templates: 'src/**/*.tpl.html',
        test: [
          'build/vendor-spec.js',
          'build/templates.js',
          'src/**/*.js', 
          'src/**/*.spec.js'
        ]
      },
      static_assets: {
        app: [
          'src/**/*.html', 
          '!src/**/*.tpl.html', 
          'src/**/*.json']
      },
      css : {
        app: 'src/**/*.scss'
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
    'build-vendor', 'build-app-js', 'build-app-static-assets','build-app-templates', 'build-app-sass'
    ], function(){

  });

  gulp.task('angular-build-spec', [
    'build-vendor-spec', 'build-app-js', 'build-app-static-assets','build-app-templates', 'build-app-sass'
    ], function(){

  });

  gulp.task('watch', function() {
    watch(config.files.js.app, {
      verbose: true
    },
    function(vinyl){
      buildApplicationJavascript();
    });

    watch(config.files.css.app, {
      verbose: true
    },
    function(vinyl){
      buildApplicationCSS();
    });

    watch(config.files.static_assets.app, {
      verbose: true
    },
    function(vinyl){
      buildApplicationStaticAssets();
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

  gulp.task('karma-watch', function() {
    gulp.src(config.files.js.test)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'watch'
      }));
  });

  gulp.task('karma', ['angular-build-spec'], function() {
    var stream = gulp.src([
        'build/vendor-spec.js',
        'build/templates.js',
        'build/application.js',
        'src/**/*.spec.js'
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

  function buildApplicationStaticAssets () {
    var stream = gulp.src(config.files.static_assets.app)
      .pipe(gulp.dest(config.build_dir))
      .pipe(cachebreaker(config.build_dir))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-static-assets', function(){
    return buildApplicationStaticAssets();
  });

  function buildApplicationTemplates(){
    var stream = gulp.src(config.files.js.templates)
      .pipe(templateCache('templates.js', {
        standalone: true
      }))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-templates', function(){
    return buildApplicationTemplates();
  });

  function buildApplicationCSS(){
    var stream = gulp.src(config.files.css.app)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(config.build_dir))
    .pipe(livereload());
    return stream;
  }

  gulp.task('build-app-sass', function(){
    return buildApplicationCSS();
  });

  gulp.task('build-vendor', function() {
    var stream = gulp.src(mainBowerFiles())
      .pipe(debug({title: 'Vendor Files:'}))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(config.build_dir))
      .pipe(livereload());
    return stream;
  });

  gulp.task('build-vendor-spec', function() {
    var stream = gulp.src(mainBowerFiles({includeDev: true}))
      .pipe(debug({title: 'Vendor Files:'}))
      .pipe(concat('vendor-spec.js'))
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
