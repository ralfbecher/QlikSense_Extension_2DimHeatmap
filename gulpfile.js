var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var path = require('path');
var buildDest = process.env.BUILD_PATH || path.resolve("./build");

var srcFiles = path.resolve('./src/**/*.*');
var name = require('./package.json').name;

gulp.task('remove-build-folder', function(){
  return del([buildDest], { force: true });
});

gulp.task('zip-build', function(){
  return gulp.src(buildDest + '/**/*')
    .pipe(zip(name + '.zip'))
    .pipe(gulp.dest(buildDest));
});

gulp.task('add-src', function(){
  return gulp.src(srcFiles).pipe(gulp.dest(buildDest));
});

gulp.task('build',
  gulp.series('remove-build-folder','add-src','zip-build')
);

gulp.task('default',
  gulp.series('build')
);
