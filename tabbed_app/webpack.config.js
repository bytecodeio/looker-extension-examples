const path = require("path")
const webpack = require("webpack")
const env_config = require('./env_config')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'src/index.tsx'),
}

module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: "http://localhost:8080/"
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: /src/,
        options: {
          plugins: [require.resolve('react-refresh/babel')],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    hot: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin(env_config()),
    new ReactRefreshWebpackPlugin(),
  ],
}
