// Base Webpack configuration.

import path from 'path'
import webpack from 'webpack'

import configuration from '../configuration'

const PROJECT_ROOT = path.resolve(__dirname, '..')

export default {
	// Resolve all relative paths from the project root folder
	context: PROJECT_ROOT,

	output: {
		// Filesystem path for static files
		path: path.resolve(PROJECT_ROOT, 'build/assets'),

		// Network path for static files
		publicPath: '/',

		// Specifies the name of each output entry file
		filename: '[name].[hash].js',

		// Specifies the name of each (non-entry) chunk file
		chunkFilename: '[name].[hash].js'
	},

	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader'
			}]
		}, {
			test: /\.css$/,
			exclude: [
				path.resolve(PROJECT_ROOT, 'src/styles/theme')
			],
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
				options: {
					// The query parameter `importLoaders` allows to configure how many
					// loaders before css-loader should be applied to @imported resources.
					// `1` - `postcss-loader`.
					importLoaders: 1,
					sourceMap: true
				}
			}, {
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			}]
		}, {
			test: /\.css$/,
			include: [
				path.resolve(PROJECT_ROOT, 'src/styles/theme')
			],
			use: [{
				loader: 'file-loader'
			}]
		}, {
			test: /\.(jpg|png|gif)$/,
			use: [{
				loader: 'file-loader',
				options: {}
			}]
		}, {
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
    	// Tell Webpack to look for `node_modules` in `captchan/node_modules`
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
    // new webpack.ProvidePlugin({
    //   STAGE_CONFIGURATION: [path.resolve(PROJECT_ROOT, 'configuration'), 'default']
    // })
    new webpack.DefinePlugin({
      STAGE_CONFIGURATION: JSON.stringify(require(path.resolve(PROJECT_ROOT, 'configuration')))
    })
	]

	// I like `import configuration from './configuration'`
	// more than `import configuration from 'configuration'`.
	// externals: {
	// 	configuration: JSON.stringify(require(path.resolve(PROJECT_ROOT, 'src/configuration')).default)
	// }
}