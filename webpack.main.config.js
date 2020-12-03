const CopyPlugin = require("copy-webpack-plugin");
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const path = require('path')

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/python", to: "python" },
      ],
    }),
    new PermissionsOutputPlugin({
      buildFiles : [{
        path :path.resolve(__dirname, '.webpack/main/python/main'),
        fileMode : '777'
      }]
    })
  ],
};