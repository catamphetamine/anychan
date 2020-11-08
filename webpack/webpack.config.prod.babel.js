import path from 'path'
import CleanPlugin from 'clean-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import configuration from './webpack.config'
// import applicationConfiguration from '../configuration'
import HtmlPlugin from './html-plugin'

// `__webpack_public_path__` is configured dynamically at runtime.
// https://webpack.js.org/guides/public-path/#on-the-fly
// // `gh-pages` will have `/captchan` base path.
// configuration.output.publicPath = (applicationConfiguration.path || '') + '/'

configuration.devtool = 'source-map'

// Minimize CSS.
// https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
configuration.optimization = {
  minimizer: [
    new TerserPlugin({
      parallel: true
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
};

configuration.plugins.push(
  // Clears the output folder before building.
  new CleanPlugin([
    path.relative(configuration.context, configuration.output.path)
  ], {
    root: configuration.context
  }),

  // Extracts CSS into a separate file.
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].[contenthash].css",
    chunkFilename: "[name].[contenthash].css"
  }),

  // Injects `js` and `css` bundles into `index.html`.
  HtmlPlugin({ googleAnalytics: true })
)

// Extracts CSS into a separate file.
const cssLoaders = configuration.module.rules[1].use
if (cssLoaders[0].loader !== 'style-loader') {
  throw new Error(`'style-loader' configuration not found`)
}
cssLoaders[0].loader = MiniCssExtractPlugin.loader

export default configuration