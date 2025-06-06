const commonConfig = require("./webpack.config");
const path = require('path');

module.exports = {
  ...commonConfig,
  output: {
    ...commonConfig.output,
    publicPath: "http://localhost:8080/",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.(js|jsx)?$/,
        use: "react-hot-loader/webpack",
        include: /node_modules/,
      },
    ],
  },
  devServer: {
    
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    server: {
      type: "https",
    }
  },
  plugins: [...commonConfig.plugins],
};
