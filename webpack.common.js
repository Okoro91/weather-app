const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config();

module.exports = {
  entry: {
    app: "./src/index.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Production",
      template: "./src/template.html",
      filename: "index.html",
    }),

    new webpack.DefinePlugin({
      "process.env.VC_API_KEY": JSON.stringify(process.env.VC_API_KEY),
      "process.env.GIPHY_API_KEY": JSON.stringify(process.env.GIPHY_API_KEY),
    }),
  ],

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
