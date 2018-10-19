const settings = require('./settings');

module.exports = (config) => {
  config.set({
    browsers: ['SlimChromeHeadless'],
    customLaunchers: {
      SlimChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--headless', '--disable-gpu', '--disable-translate', '--disable-extensions']
      }
    },
    files: [
      { pattern: 'src/*.spec.js', watched: false }
    ],
    frameworks: ['jasmine'],
    preprocessors: {
      'src/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'source-map',
      mode: settings.mode,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            loaders: ['babel-loader']
          },
          { test: /\.less$/, loader: 'ignore-loader' },
          { test: /\.json$/, loader: 'ignore-loader' }
        ]
      }
    }
  });
};
