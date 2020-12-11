const path = require('path');

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'VideoRecording.js',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: ['ts-loader']
    }]
  },
};