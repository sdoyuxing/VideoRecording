const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'VideoRecording.js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: ['ts-loader']
    }]
  },
  devtool: 'source-map' // 输出 Source Map 方便在浏览器里调试 TypeScript 代码
};