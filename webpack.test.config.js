var webpack = require('webpack')

module.exports = {
  entry: [
    './test/nuclearMixin.spec.js',
    './test/provideReactor.spec.js',
    './test/nuclearComponent.spec.js',
  ],
  target: 'web',

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },

  node: {
    Buffer: false,
    process: false,
    global: true,
    __dirname: false,
    __filename: false,
  },

  output: {
    path: __dirname,
    filename: 'test.bundle.js',
  },
}
