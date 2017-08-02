module.exports = {
  entry: [
    './src/index.js'
  ],
  target: 'web',
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments'
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
  },
  node: {
    console: true,
    __filename: true,
    __dirname: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    crypto: 'empty'
  }
};
