import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanPlugin from 'clean-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const configuration = require('./webpack.config')

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

  // Shows the resulting bundle size stats.
  // https://blog.etleap.com/2017/02/02/inspecting-your-webpack-bundle/
  new Visualizer({
    // The path is relative to the output folder
    filename : '../bundle-stats.html'
  })
)


module.exports = configuration