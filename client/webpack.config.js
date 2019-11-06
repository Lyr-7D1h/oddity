module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        issuer: /\.less$/,
        use: [
          {
            loader: "js-to-less-loader"
          }
        ]
      }
    ]
  }
};
