module.exports = {
  entry: './client/app/main.tsx',
  output: {
    filename: './server/public/bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.tsx']
  },
  module: {
    loaders: [
      { test: /.tsx$/, loader: 'awesome-typescript-loader' }
    ]
  }
};