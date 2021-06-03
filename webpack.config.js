const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
  entry: path.resolve(__dirname, 'public/src'),
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'url-loader',
      },
    ],
  },
  // plugins: [
  //   new CompressionPlugin(),
  // ],
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};