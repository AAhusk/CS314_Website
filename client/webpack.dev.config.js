const path = require('path')
const webpack = require('webpack')

/*
 * This is a Webpack configuration file. Webpack is a module bundler, and is
 * responsible for putting together all of our JavaScript source code into
 * (usually) a single file so it may be served in a web browser.
 * Comments in this file will outline what webpack does; read more about
 * webpack here: https://webpack.js.org/concepts/
 * You should not make any changes to this file during the semester.
 * See a less commented version in ./webpack.prod.config.js
 */

// What ports the website is served from, and where it first looks for
// the REST server (on localhost), respectively.
const dev_port = 31401;
const server_port = 31400;

/*
 * Think of module.exports as the "what's in this file" of JavaScript.
 * That is, this file represents a module, which contains what's defined below.
 */
module.exports = {
  // Noting the mode allows Webpack to make some optimizaitons depending
  // on if we are developing or in production.
  mode: 'development',

  // These are the settings for our hot-reloading development server, for faster
  // development. The server will automatically reload when you change a file,
  // so you don't have to rebundle!
  devServer: {
    port: dev_port,
    open: true,
    hot: true,
  },

  /*
   * The entry is where Webpack kicks off the bundling.
   * entry.jsx contains the first rendering of React
   * Babel-polyfill implements features that web browsers may not natively have
   * https://en.wikipedia.org/wiki/Polyfill_(programming)
   */
  entry: [
    'babel-polyfill',
    './src/entry.jsx'
  ],

  // Output determines where the final bundled JavaScript should go.
  output: {
    path: path.join(__dirname, '/'),
    filename: 'bundle.js',
  },

  // These are the different plugins we can use
  plugins: [
    new webpack.DefinePlugin({
      'process.env.dev': server_port
    }),
    new webpack.NamedModulesPlugin(),

    // This is the plugin that causes the page to refresh when changes to any
    // imported module are made.
    new webpack.HotModuleReplacementPlugin()
  ],

  /*
   * module.rules is where we tell Webpack how to handle different types of
   * files. In general, files are fed through "loaders" which produce output
   * that can be fed to the browser in the end product. Loaders exist for
   * JavaScript, stylesheets, files, and more.
   */
  module: {
    // Rules "test" for a matching file name (a regex), and then apply the
    // specified loader(s) to all matching files.
    rules: [
      // Rule 1: JavaScript source. Babel is a compiler, but is really a
      // transpiler, converting modern JavaScript to an older-syntax,
      // browser-safe version.
      {
        test: /\.(js|jsx)/, use: 'babel-loader',
        include: path.join(__dirname, './', 'src'),
      },
      // Rule 2: Stylesheets (CSS). Use style-loader first, then css-loader.
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // Rule 3: Images: Use file-loader.
      { test: /\.(png|jpg|gif|svg)$/, use: {
        loader: 'file-loader',
        options: { name: 'images/[name]-[hash:8].[ext]' }}
      }
    ]
  }
}
