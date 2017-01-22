module.exports = {
  entry: './src/client/main.tsx',
  output: {
    filename: './public/bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [
      { test: /.tsx?$/, loader: 'awesome-typescript-loader' }
    ]
  }
};