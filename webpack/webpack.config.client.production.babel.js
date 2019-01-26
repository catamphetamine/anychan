import settings from '../../webapp-frontend/webpack/universal-webpack-settings'
import baseConfiguration from './webpack.config'

import { createConfig } from '../../webapp-frontend/webpack/webpack.config.client.production.babel'

export default createConfig(baseConfiguration, settings)