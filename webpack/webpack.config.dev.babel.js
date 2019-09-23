import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import applicationConfiguration from '../configuration'

import configuration from './webpack.config'

// `webpack-dev-server` can't set the correct `mode` by itself
// so setting `mode` to `"development"` explicitly.
// https://github.com/webpack/webpack-dev-server/issues/1327
configuration.mode = 'development'

// configuration.devtool = 'cheap-module-eval-source-map'

configuration.plugins.push(
	// Prints more readable module names in the browser console on HMR updates.
	new webpack.NamedModulesPlugin(),

  // Injects `js` bundle into `index.html`.
	new HtmlWebpackPlugin({
		template: 'src/index.html',
		// favicon: 'assets/images/icon@192x192.png',
    // Seems to use "lodash" templates.
    templateParameters: {
      googleAnalytics: null // applicationConfiguration.googleAnalytics
    }
	})
)

const { port } = applicationConfiguration.webpack.devserver

configuration.output.publicPath = `http://localhost:${port}${configuration.output.publicPath}`

// `webpack-dev-server`.
configuration.devServer = {
	port,
  contentBase: configuration.output.path,
	// https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
	historyApiFallback: true
}

export default configuration