const fs = require("fs");
const path = require("path");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
if (!process.env.POSTS_SERVER_URL) {
  // webpack 5 is stricter about environment variables. The POSTS_SERVER_URL
  // environment variable was not mentioned in the README so default it for
  // those developers who may have created a .env file without the variable.
  process.env.POSTS_SERVER_URL = "http://127.0.0.1:3000";
}

const PATHS = {
  app: path.join(__dirname, "src/index.js"),
};

module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: /src/,
        sideEffects: false,
      },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js",".css"],
    fallback: { buffer: false },
  },
  devtool: "source-map",
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE_MODE || "disabled",
    }),
  ],
};
