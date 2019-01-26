import { serverConfiguration } from 'universal-webpack'
import settings from '../../webapp-frontend/webpack/universal-webpack-settings'
import baseConfiguration from './webpack.config'

export default serverConfiguration(baseConfiguration, settings)