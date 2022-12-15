import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { createConfiguration } from './webpack.config.js'
// import applicationConfiguration from '../configuration.js'

const configuration = createConfiguration({ development: false })

// `__webpack_public_path__` is configured dynamically at runtime.
// https://webpack.js.org/guides/public-path/#on-the-fly
// configuration.output.publicPath = (applicationConfiguration.path || '') + '/'

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
  new CleanWebpackPlugin(),

  // Extracts CSS into a separate file.
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].[contenthash].css",
    chunkFilename: "[name].[contenthash].css"
  })
])

// Extracts CSS into a separate file.
const cssLoaders = configuration.module.rules[1].use
if (cssLoaders[0].loader !== 'style-loader') {
  throw new Error(`'style-loader' configuration not found`)
}
cssLoaders[0].loader = MiniCssExtractPlugin.loader

export default configuration