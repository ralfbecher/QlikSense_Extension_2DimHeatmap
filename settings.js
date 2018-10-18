const path = require('path');
const packageJSON = require('./package.json');

module.exports = {
  buildDestination: process.env.BUILD_PATH || path.resolve("./build"),
  mode: process.env.NODE_ENV || 'development',
  name: packageJSON.name
};
