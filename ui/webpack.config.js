"use strict";

const webpack = require("webpack");
require('dotenv').config({path: "../.env"})

let plugins = [
  new webpack.EnvironmentPlugin([
    "API_URL",
    "NODE_ENV",
    "GA_TRACKING_ID",
  ]),
]

let pluginsProd = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
]

if(process.env.NODE_ENV === "production") {
  plugins = plugins.concat(pluginsProd)
}

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: "./dist",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader?presets[]=es2015!ts-loader",
      },
      {
        test: /\.(scss|sass)$/,
        loader: "style-loader!css-loader!sass-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
    ],
  },
  devServer: {
    contentBase: 'dist',
    port: 23000
  },
  plugins: plugins
};
