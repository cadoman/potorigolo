const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const CopyPlugin = require("copy-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  use: [{ loader: 'url-loader' }],
})
module.exports = {
  module: {
    rules,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
      ],
    }), ...plugins],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },

};
