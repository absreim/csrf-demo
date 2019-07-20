module.exports = {
  entry: [
    './client/src/index.jsx'
  ],
  output: {
    path: __dirname,
    filename: './client/public/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
