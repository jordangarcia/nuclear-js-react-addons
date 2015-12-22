module.exports = {
  entry: ['./index.js'],

  output: {
    library: 'NuclearJSReactAddons',
    libraryTarget: 'umd',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },

  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
  ],
}
