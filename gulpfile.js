var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var path = require('path');
var settings = require('./settings');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var jeditor = require("gulp-json-editor");

var buildDest = settings.buildDestination;
var srcFiles = path.resolve('./src/**/*.*');
var name = settings.name;
var version = settings.version;

gulp.task('remove-build-folder', function(){
  return del([buildDest], { force: true });
});

gulp.task('zip-build', function(){
  return gulp.src(buildDest + '/**/*')
    .pipe(zip(name + '_v' + version + '.zip'))
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

gulp.task('update-qext-version', function () {
  return gulp.src("./build/" + name + ".qext")
    .pipe(jeditor({
      'version': version
    }))
  .pipe(gulp.dest("./build"));
})

gulp.task('build',
  gulp.series('remove-build-folder', 'webpack-build', 'update-qext-version', 'zip-build')
);

gulp.task('default',
  gulp.series('build')
);

gulp.task('watch', () => new Promise((resolve, reject) => {
  const compiler = webpack(webpackConfig);
  const originalOutputFileSystem = compiler.outputFileSystem;
  const devServer = new WebpackDevServer(compiler, {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
  }).listen(settings.port, 'localhost', error => {
    compiler.outputFileSystem = originalOutputFileSystem;
    if (error) {
      console.error(error); // eslint-disable-line no-console
      return reject(error);
    }

    // eslint-disable-next-line no-console
    console.log('Listening at localhost:' + settings.port);

    resolve(null, devServer);
  });
}));
