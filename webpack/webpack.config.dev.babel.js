import webpack from 'webpack'

// import applicationConfiguration from '../configuration'
import HtmlPlugin from './html-plugin'

import configuration from './webpack.config'

const PORT = 1234

// `webpack-dev-server` can't set the correct `mode` by itself
// so setting `mode` to `"development"` explicitly.
// https://github.com/webpack/webpack-dev-server/issues/1327
configuration.mode = 'development'

// For profiling.
// configuration.mode = 'production'

// configuration.devtool = 'cheap-module-eval-source-map'

configuration.plugins.push(
	HtmlPlugin({ dev: true })
)

configuration.output.publicPath = `http://localhost:${PORT}${configuration.output.publicPath}`

// Prints more readable module names in the browser console on HMR updates.
configuration.optimization = {
	...configuration.optimization,
	moduleIds: 'named'
}

configuration.snapshot = {
	...configuration.snapshot,
	// Fixes webpack caching `node_modules` folder.
	// https://github.com/webpack/webpack/issues/11952
	// https://webpack.js.org/blog/2020-10-10-webpack-5-release/#persistent-caching
	managedPaths: []
}

// `webpack-dev-server`.
configuration.devServer = {
	port: PORT,
  contentBase: configuration.output.path,
	// https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
	historyApiFallback: true
}

// For profiling.
// configuration.optimization = {
// 	// Disables minifier in production mode.
// 	minimize: false
// }

export default configuration