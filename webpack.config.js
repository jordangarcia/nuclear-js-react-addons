module.exports = {
  entry: ['./index.js'],

  output: {
    library: 'NuclearJSReactAddons',
    libraryTarget: 'umd',
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
