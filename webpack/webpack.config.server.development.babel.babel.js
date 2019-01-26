import configuration from './webpack.config.server.production.babel.js'
import applicationConfiguration from '../configuration'

import { createConfig } from '../../webapp-frontend/webpack/webpack.config.server.development.babel'

export default createConfig(configuration, applicationConfiguration)