const path = require("path");

const PATHS = {
  app: path.join(__dirname, "src/index.js"),
};

module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: __dirname + "/dist",
    filename: "floorplan_app.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: /src/,
        sideEffects: false,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/inline', // Change this line to inline assets as base64
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 * 1024 // 8MB - adjust this if needed
          }
        }
      }
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
    fallback: { buffer: false },
  },
};
