const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.js');
const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

if (!commonConfig.plugins) {
  commonConfig.plugins = [];
}

// Ensure the certs directory exists
const certsDir = path.resolve(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFileSync(path.resolve(certsDir, 'server.key'), pems.private);
fs.writeFileSync(path.resolve(certsDir, 'server.crt'), pems.cert);

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    ...commonConfig.output,
    publicPath: "https://localhost:8080/",
  },
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
    index: "index.html",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    hot: true,
    port: 8080,
    disableHostCheck: true,
    https: {
      key: fs.readFileSync(path.resolve(certsDir, 'server.key')),
      cert: fs.readFileSync(path.resolve(certsDir, 'server.crt')),
    },
  },
});
