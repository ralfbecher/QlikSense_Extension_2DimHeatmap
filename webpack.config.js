const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const settings = require('./settings');

console.log('Webpack mode:', settings.mode); // eslint-disable-line no-console

const config = {
  devtool: 'source-map',
  entry: [
    './src/' + settings.name + '.js'
  ],
  mode: settings.mode,
  output: {
    path: settings.buildDestination,
    filename: settings.name + '.js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules|d3.min.js)/,
        loader: "eslint-loader",
        options: {
          failOnError: true
        }
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      'src/' + settings.name + '.qext',
      'src/wbfolder.wbl'
    ], {}),
    new StyleLintPlugin()
  ]
};

if (process.env.NODE_ENV !== 'production') {
  config.entry.unshift('webpack-dev-server/client?http://localhost:' + settings.port);
}

module.exports = config;
