// Base Webpack configuration.
//
// Not using ES6 syntax here because this file
// is not processed with Babel on server side.
// See `./rendering-service/index.js` for more info.

const path = require('path')
const webpack = require('webpack')

const PROJECT_ROOT = path.resolve(__dirname, '..')

module.exports =
{
	// Resolve all relative paths from the project root folder
	context: PROJECT_ROOT,

	output:
	{
		// Filesystem path for static files
		path: path.resolve(PROJECT_ROOT, 'build/assets'),

		// Network path for static files
		publicPath: '/',

		// Specifies the name of each output entry file
		filename: '[name].[hash].js',

		// Specifies the name of each (non-entry) chunk file
		chunkFilename: '[name].[hash].js'
	},

	module:
	{
		rules:
		[{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader'
			}]
		},
		{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader : 'css-loader',
				options:
				{
					// The query parameter `importLoaders` allows to configure how many
					// loaders before css-loader should be applied to @imported resources.
					// `1` - `postcss-loader`.
					importLoaders : 1,
					sourceMap     : true
				}
			}, {
				loader : 'postcss-loader'
			}]
		},
		{
			test: /\.(jpg|png)$/,
			use: [{
				loader : 'url-loader',
				options: {
					// Any png-image or woff-font below or equal to 5K
					// will be converted to inline base64 instead.
					limit: 5120
				}
			}]
		},
		{
			test: /\.svg$/,
			exclude: [
				path.resolve(PROJECT_ROOT, 'assets/images/account-picture.svg')
			],
			use: [{
				loader: 'svg-react-loader'
			}]
		}]
	},

	// Hides "Entrypoint size exeeds the recommened limit (250kB)" warnings.
	// https://github.com/webpack/webpack/issues/3486
	performance: {
		hints: false
	},

	resolve: {
    modules: [
    	// Tell Webpack to look for `node_modules` in `chanchan/node_modules`
    	// instead of `webapp-frontend/node_modules`.
      'node_modules',
      // Using a relative path here instead of a global path
      // to work around Webpack bug.
      // https://github.com/webpack/webpack/issues/7863
      path.basename(path.join(__dirname, '..')) + '/node_modules'
    ],
		alias: {
			'webapp-frontend': path.resolve(PROJECT_ROOT, '../webapp-frontend')
		}
	},

	// Plugins will be added to this array by extending configurations.
	plugins: [
    new webpack.ProvidePlugin({
      configuration: [path.resolve(PROJECT_ROOT, 'src/configuration'), 'default']
    })
	]
}