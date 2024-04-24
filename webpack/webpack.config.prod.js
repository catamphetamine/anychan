// import { BundleAnalyzerPlugin } from 'webpack-analyzer-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { createConfiguration } from './webpack.config.js'
// import getApplicationConfiguration from '../getConfiguration.ts'

const configuration = createConfiguration({ development: false })

// The trailing slash is required.
configuration.output.publicPath = '/assets/'

// `__webpack_public_path__` is configured dynamically at runtime.
// https://webpack.js.org/guides/public-path/#on-the-fly
// configuration.output.publicPath = (getApplicationConfiguration().path || '') + '/'

// Minimize CSS.
// https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
configuration.optimization = {
  minimizer: [
    new TerserPlugin({
      parallel: true
    }),
    new CssMinimizerPlugin()
  ]
};

configuration.plugins = configuration.plugins.concat([
  // Clears the output folder before building.
  // (doesn't seem to work?)
  new CleanWebpackPlugin(),

  // Extracts CSS into a separate file.
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].[contenthash].css",
    chunkFilename: "[name].[contenthash].css"
  }),

  // // Reports the size of the bundle.
  // new BundleAnalyzerPlugin({
  //   analyzerMode: 'static',
  //   reportFilename: 'bundle-stats.html',
  //   openAnalyzer: false
  // })
])

// Extracts CSS into a separate file.
const cssLoaders = configuration.module.rules[2].use
if (cssLoaders[0].loader !== 'style-loader') {
  throw new Error(`[anychan-build] 'style-loader' configuration not found in the 3rd \`rule\` of \`use\` list in \`webpack.config.js\``)
}
cssLoaders[0].loader = MiniCssExtractPlugin.loader

export default configuration