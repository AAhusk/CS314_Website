const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: [
    'babel-polyfill',
    './src/entry.jsx'
  ],
  output: {
    path: path.join(__dirname, './dist/public/'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({ })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)/, use: 'babel-loader',
        include: path.join(__dirname, 'src'),
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpg|gif|svg)$/, use: {
        loader: 'file-loader',
        options: { name: '[path][name]-[hash:8].[ext]' } }
      }
    ]
  }
}
