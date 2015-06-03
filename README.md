# angular_build
A build process for AngularJS projects using Gulp


###Setup 
Add angular_build to your dependencies via github as it's not a registered npm module yet.
```
"dependencies": {
    ...
    "angular_build": "chrisface/angular_build",
    ...
  }
```

Install the new dependency
```
npm install
```

If you want to use the `gulp` command from the terminal you will need to install Gulp globally.
```
npm install gulp -g
```

Add angular_build to your `gulpfile.js`

```
var angular_build = require('angular_build')(gulp);
```

###Usage

To run a full build
```
gulp angular-build
```

To run tests
```
gulp spec
```

To run a built-in webserver which watches for changes and triggers a live-reload
```
gulp webserver
```

Configure default grunt task to run a full build
```
gulp.task('default', [
  'angular-build'
]);
```
