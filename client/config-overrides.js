const {
  babelInclude,
  override,
  removeModuleScopePlugin,
  addWebpackAlias,
  addLessLoader,
} = require('customize-cra')

const path = require('path')

module.exports = override(
  //   fixBabelImports("import", {
  //     libraryName: "antd",
  //     libraryDirectory: "es",
  //     style: "css"
  //   }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': 'rgb(56, 56, 56)',
      '@link-color': 'rgb(100,100,100)',
    },
  }),

  // addWebpackModuleRule({
  //   test: /\.js?$/,
  //   // include: path.resolve(__dirname, '../modules'),
  //   exclude: /node_modules/,
  //   use: [
  //     {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['react']
  //       }
  //     }
  //   ]
  // }),

  // Remove import scope & add modules to babel-loader scope
  removeModuleScopePlugin(),
  babelInclude([path.resolve('src'), path.resolve('../modules')]), // TODO: might be insecure

  // Add alias for components to easily fetch it
  addWebpackAlias({
    Components: path.resolve(__dirname, 'src', 'components'),
    Helpers: path.resolve(__dirname, 'src', 'helpers'),
    Actions: path.resolve(__dirname, 'src', 'redux', 'actions'),
  })
)
