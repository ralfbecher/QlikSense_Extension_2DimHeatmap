var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var path = require('path');
var settings = require('./settings');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');

var buildDest = settings.buildDestination;
var srcFiles = path.resolve('./src/**/*.*');
var name = settings.name;

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

gulp.task('webpack-build', done => {
  webpack(webpackConfig, (error, statistics) => {
    const compilationErrors = statistics && statistics.compilation.errors;
    const hasCompilationErrors = !statistics || (compilationErrors && compilationErrors.length > 0);

    console.log(statistics && statistics.toString({ chunks: false, colors: true })); // eslint-disable-line no-console

    if (error || hasCompilationErrors) {
      console.log('Build has errors or eslint errors, fail it'); // eslint-disable-line no-console
      process.exit(1);
    }

    done();
  });
});

gulp.task('build',
  gulp.series('remove-build-folder', 'webpack-build', 'zip-build')
);

gulp.task('default',
  gulp.series('build')
);
