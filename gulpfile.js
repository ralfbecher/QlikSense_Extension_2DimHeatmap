var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var runSequence = require('run-sequence');
var path = require('path');
var buildDest = path.resolve("./build");

var srcFiles = path.resolve('./src/**/*.*');
var name = require('./package.json').name;

gulp.task('remove-build-zip', function(){
  del.sync([buildDest + "/" + name + '.zip']);
});

gulp.task('zip-build', function(){
  return gulp.src(buildDest + '/**/*')
    .pipe(zip(name + '.zip'))
    .pipe(gulp.dest(buildDest));
});

gulp.task('add-src', function(){
  return gulp.src(srcFiles).pipe(gulp.dest(buildDest));
});

gulp.task('build', function() {
  runSequence(
    'remove-build-zip',
    'add-src',
    'zip-build'
  );
});

