import settings from '../../webapp-frontend/webpack/universal-webpack-settings'
import baseConfiguration from './webpack.config'
import applicationConfiguration from '../configuration'

import { createConfig } from '../../webapp-frontend/webpack/webpack.config.client.development.babel'

export default createConfig(baseConfiguration, settings, applicationConfiguration)