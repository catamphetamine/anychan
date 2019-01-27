import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanPlugin from 'clean-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import configuration from './webpack.config'

// `gh-pages` will have `/chanchan` base path.
configuration.output.publicPath = '/chanchan'

configuration.devtool = 'source-map'

// Minimize CSS.
// https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
configuration.optimization = {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
};

configuration.plugins.push(
	new HtmlWebpackPlugin({
		template: 'src/index.html',
		// favicon: 'assets/images/icon@192x192.png',
		// // Seems to use "lodash" templates.
		// templateParameters: {
		// 	disableSentryIO: 'true',
		// 	sentryIOHash: null,
		// 	sentryIOProjectId: null
		// }
	})
)

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
    filename: "[name].[hash].css",
    chunkFilename: "[name].[hash].css"
  }),

  // Shows the resulting bundle size stats.
  // https://blog.etleap.com/2017/02/02/inspecting-your-webpack-bundle/
  new Visualizer({
    // The path is relative to the output folder
    filename : '../bundle-stats.html'
  })
)

// Extracts CSS into a separate file.
const cssLoaders = configuration.module.rules[1].use
if (cssLoaders[0].loader !== 'style-loader') {
  throw new Error(`'style-loader' configuration not found`)
}
cssLoaders[0].loader = MiniCssExtractPlugin.loader

module.exports = configuration