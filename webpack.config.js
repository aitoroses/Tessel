var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {

  output: {
    library: 'Tessel',
    libraryTarget: 'umd'
  },

  externals: [
    {
      // "react": {
      //   root: "React",
      //   commonjs2: "react",
      //   commonjs: "react",
      //   amd: "react"
      // },
      // "immutable": "immutable",
      // "_": "lodash"
    }
  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },

  node: {
    Buffer: false
  },

  plugins: plugins

};
